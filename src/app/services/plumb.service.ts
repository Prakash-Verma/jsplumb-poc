import {
  ComponentFactoryResolver,
  ElementRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import {
  BrowserJsPlumbInstance,
  EVENT_ELEMENT_CLICK,
  newInstance,
} from '@jsplumb/browser-ui';
import { FlowchartConnector } from '@jsplumb/connector-flowchart';
import {
  EndpointOptions,
  EVENT_GROUP_MEMBER_ADDED,
  EVENT_GROUP_MEMBER_REMOVED,
  EVENT_NESTED_GROUP_REMOVED,
  UIGroup,
} from '@jsplumb/core';
import { PointXY } from '@jsplumb/util';

import { NotificationService } from '../components/notification/notification.service';
import { Interaction } from '../chatbot/models/interaction';
import {
  ElementComponentRef,
  getConnectorMenuComponent,
  getElementComponent,
  getGroupComponent,
  getRoutingRuleComponent,
  GroupComponentRef,
  PlumbConnection,
  PlumbGroup,
  PlumbJson,
  PlumbNode,
  RoutingRuleComponentRef,
} from './utils';
import { InteractionRouteModel } from '../chatbot/models/interaction-route';
import {
  RoutingNodes,
  RoutingRuleTarget,
} from '../chatbot/models/routing-rule-target';

const elementPrefix = 'Element';
const groupPrefix = 'Group';

@Injectable()
export class PlumbService {
  private _containerRef: ViewContainerRef | undefined;
  get containerRef() {
    if (!this._containerRef) {
      throw new Error('Root container not initialized');
    }
    return this._containerRef;
  }
  set containerRef(value: ViewContainerRef) {
    this._containerRef = value;
  }

  private _jsPlumbInstance: BrowserJsPlumbInstance | undefined;
  get jsPlumbInstance() {
    if (!this._jsPlumbInstance) {
      throw new Error('jsPlumbInstance is not yet set');
    }
    return this._jsPlumbInstance;
  }
  set jsPlumbInstance(value: BrowserJsPlumbInstance) {
    this._jsPlumbInstance = value;
  }

  private elements: ElementComponentRef[] = [];
  private groups: GroupComponentRef[] = [];

  private routingRules: RoutingRuleComponentRef[] = [];

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private notification: NotificationService
  ) {}

  public initializeJsInstance(rootElementRef: ElementRef) {
    this.jsPlumbInstance = newInstance({
      container: rootElementRef.nativeElement,
      connector: { type: FlowchartConnector.type, options: { gap: 5 } },
    });

    this.setHandlers();
  }

  public setContainer(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  public addElement(elementId?: string) {
    if (!elementId) {
      elementId = `${elementPrefix}_${guidGenerator()}`;
    }

    const componentRef = getElementComponent(
      this.factoryResolver,
      this.containerRef
    );
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;

    this.elements.push(componentRef);
    return componentRef;
  }

  public addRoutingRule(
    elementId?: string,
    interactionRouteModel?: InteractionRouteModel
  ) {
    if (!elementId) {
      elementId = `${elementPrefix}_${guidGenerator()}`;
    }

    const componentRef = getRoutingRuleComponent(
      this.factoryResolver,
      this.containerRef
    );
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    if (interactionRouteModel) {
      componentRef.instance.interactionRouteModel = interactionRouteModel;
    }
    this.routingRules.push(componentRef);
    return componentRef;
  }

  public addGroup(
    elementId: string | undefined,
    interaction?: Interaction,
    index?: number
  ) {
    if (!elementId) {
      elementId = `${groupPrefix}_${guidGenerator()}`;
    }
    //const isFirstElement = this.groups.length === 0;

    const componentRef = getGroupComponent(
      this.factoryResolver,
      this.containerRef
    );
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    componentRef.instance.needSource = true;
    componentRef.instance.needTarget = true;
    if (interaction) {
      componentRef.instance.interaction = interaction;
    }
    if (index) {
      componentRef.instance.index = index;
    }

    this.groups.push(componentRef);
    return componentRef;
  }

  private setHandlers() {
    this.jsPlumbInstance.bind(
      EVENT_GROUP_MEMBER_ADDED,
      (params: {
        group: UIGroup<HTMLElement>;
        el: HTMLElement;
        pos: PointXY;
      }) => {
        this.adjustPositionAndUI(params.el, params.group);
        setTimeout(() => {
          this.jsPlumbInstance.repaintEverything();
        }, 0);
      }
    );

    this.jsPlumbInstance.bind(
      EVENT_GROUP_MEMBER_REMOVED,
      (params: {
        group: UIGroup<HTMLElement>;
        el: HTMLElement;
        pos: PointXY;
      }) => {
        params.group.el.style.height =
          parseInt(params.group.el.style.height.replace('px', '')) -
          parseInt(getComputedStyle(params.el).height.replace('px', '')) +
          'px';

        setTimeout(() => {
          this.jsPlumbInstance.repaintEverything();
        }, 0);
      }
    );

    this.jsPlumbInstance.bind(
      EVENT_NESTED_GROUP_REMOVED,
      (params: {
        parent: UIGroup<HTMLElement>;
        child: UIGroup<HTMLElement>;
      }) => {
        params.parent.el.style.height =
          parseInt(params.parent.el.style.height.replace('px', '')) -
          parseInt(getComputedStyle(params.child.el).height.replace('px', '')) +
          'px';

        setTimeout(() => {
          this.jsPlumbInstance.repaintEverything();
        }, 0);
      }
    );

    this.jsPlumbInstance.bind(EVENT_ELEMENT_CLICK, (element: HTMLElement) => {
      const groupOfEle = this.jsPlumbInstance.getGroupFor(element);
      const isGroup = element.id.includes('Group');
      if (groupOfEle || isGroup) {
        this.jsPlumbInstance.repaintEverything();
      }
    });
  }

  private adjustPositionAndUI(
    element: HTMLElement,
    group: UIGroup<HTMLElement>
  ) {
    this.adjustGroupWidth(group);
    this.setElementPositionInGroup(group, element);
    this.adjustGroupHeight(element, group.el);
  }

  private adjustGroupWidth(group: UIGroup<HTMLElement>) {
    let maxWidth = 0;
    group.children.forEach((child) => {
      if (child.el.offsetWidth > maxWidth) {
        maxWidth = child.el.offsetWidth;
      }
    });

    if (group.el.offsetWidth < maxWidth + 50) {
      group.el.style.width = maxWidth + 50 + 'px';
    }
  }

  private adjustGroupHeight(element: HTMLElement, groupEle: HTMLElement) {
    const bottomSpace = parseInt(
      getComputedStyle(element).bottom.replace('px', '')
    );
    if (bottomSpace <= 0) {
      groupEle.style.height =
        groupEle.offsetHeight + 10 + Math.abs(bottomSpace) + 'px';
    }
  }

  private setElementPositionInGroup(
    group: UIGroup<HTMLElement>,
    element: HTMLElement
  ) {
    const position = calculatePosition(group, element);
    this.jsPlumbInstance.setPosition(element, position);
  }

  public addSourceElement(
    nativeElement: HTMLElement,
    color: string = '#b731a9'
  ) {
    const source: EndpointOptions = {
      endpoint: 'Dot',
      paintStyle: { fill: '#fff', stroke: color },
      source: true,
      connectorStyle: { stroke: color, strokeWidth: 1 },
      maxConnections: 5,
      connectorOverlays: [
        { type: 'PlainArrow', options: { location: 1, width: 12, length: 10 } },
        {
          type: 'Custom',
          options: {
            create: () => {
              const component = getConnectorMenuComponent(
                this.factoryResolver,
                this.containerRef
              );
              component.instance.parentElementId = nativeElement.id;
              component.instance.jsPlumbInstance = this.jsPlumbInstance;
              return component.instance.elementRef.nativeElement;
            },
            location: 0.5,
          },
        },
      ],
      connectorHoverStyle: {
        fill: 'none',
        outlineStroke: 'transparent',
        outlineWidth: 7,
      },
    };
    this.jsPlumbInstance.addEndpoint(
      nativeElement,
      {
        anchor: 'Right',
      },
      source
    );
  }

  public addTargetElement(nativeElement: HTMLElement) {
    const target: EndpointOptions = {
      endpoint: {
        type: 'Dot',
        options: { radius: 5 },
      },
      paintStyle: { stroke: '#b731a9', fill: '#fff' },
      maxConnections: 5,
      target: true,
    };

    this.jsPlumbInstance.addEndpoint(nativeElement, { anchor: 'Left' }, target);
  }

  public createAndSaveJson(savePosition = true) {
    const plumbGroups = this.getPlumbGroups(savePosition);
    const plumbNodes = this.getPlumbNodes(savePosition);

    const plumbConnections = this.getConnections();
    const plumbJson = {
      groups: plumbGroups,
      nodes: plumbNodes,
      connections: plumbConnections,
    };
    console.log('plumbJson: ', plumbJson);
    localStorage.setItem('plumbJson', JSON.stringify(plumbJson));
  }

  private getConnections(): PlumbConnection[] {
    return this.jsPlumbInstance.connections.map((conn) => {
      return {
        connectionId: conn.id,
        source: { id: conn.source.id, isGroup: conn.source._isJsPlumbGroup },
        target: { id: conn.target.id, isGroup: conn.target._isJsPlumbGroup },
      };
    });
  }

  recreate() {
    const plumbCookie = localStorage.getItem('plumbJson');
    if (!plumbCookie) {
      alert('Please save a diagram first!!!');
      return;
    }

    const jsonObj = <PlumbJson>JSON.parse(plumbCookie);
    console.log('plumbJson', jsonObj);

    const isDirtyCanvas = isDirtyCanvasFn(jsonObj);
    if (isDirtyCanvas) {
      this.notification.show(
        'Canvas is not clean please clear and then recreate!!!'
      );
      return;
    }

    this.jsPlumbInstance.setSuspendDrawing(true);
    const container = <HTMLElement>this.jsPlumbInstance.getContainer();
    container.style.opacity = '0';

    let offsetLeft = 20;
    const offsetTop = window.innerHeight / 3;

    const groups = jsonObj.groups.map((group) => {
      const component = this.addGroup(group.id);
      if (group.style) {
        component.location.nativeElement.style.left =
          group.style.offsetLeft + 'px';
        component.location.nativeElement.style.top =
          group.style.offsetTop + 'px';
      } else {
        component.location.nativeElement.style.left = offsetLeft + 'px';
        offsetLeft += component.location.nativeElement.offsetWidth + 100;
        component.location.nativeElement.style.top = offsetTop + 'px';
      }
      return component;
    });

    const nodes = jsonObj.nodes.map((node) => {
      const component = this.addElement(node.id);
      if (node.style) {
        component.location.nativeElement.style.left =
          node.style.offsetLeft + 'px';
        component.location.nativeElement.style.top =
          node.style.offsetTop + 'px';
      } else {
        component.location.nativeElement.style.left = offsetLeft + 'px';
        offsetLeft += component.location.nativeElement.offsetWidth + 100;
        component.location.nativeElement.style.top = offsetTop + 'px';
      }
      return component;
    });

    setTimeout(() => {
      const normalGroup: PlumbGroup[] = [];
      const groupWithNestedGroup: PlumbGroup[] = [];
      jsonObj.groups.forEach((g) => {
        const hasGroupAsChild = g.children.some((childId) =>
          childId.includes('Group')
        );
        if (hasGroupAsChild) {
          groupWithNestedGroup.push(g);
        } else {
          normalGroup.push(g);
        }
      });

      normalGroup.concat(groupWithNestedGroup).forEach((group) => {
        this.addNodesToGroup(this.jsPlumbInstance, group);
      });
    }, 0);

    setTimeout(() => {
      this.createConnections(jsonObj.connections);

      container.style.opacity = '1';
      this.jsPlumbInstance.setSuspendDrawing(false);
    }, 0);

    this.groups = groups;
    this.elements = nodes;
  }

  setSuspendDrawing(value: boolean) {
    this.jsPlumbInstance.setSuspendDrawing(false);
  }
  repaintEverything() {
    this.jsPlumbInstance.repaintEverything();
  }

  createConnections(connections: PlumbConnection[]) {
    connections.forEach((conn) => {
      this.createSingleConnection(conn);
    });
  }

  public createSingleConnection(conn: PlumbConnection) {
    const srcEndpoint = getEndpointForConnection(
      conn.source.id,
      conn.source.isGroup,
      true,
      this.jsPlumbInstance
    );
    const targetEndpoint = getEndpointForConnection(
      conn.target.id,
      conn.target.isGroup,
      false,
      this.jsPlumbInstance
    );
    if (srcEndpoint && targetEndpoint) {
      this.jsPlumbInstance.connect({
        source: srcEndpoint,
        target: targetEndpoint,
      });
    }
  }

  private addNodesToGroup(
    jsPlumbInstance: BrowserJsPlumbInstance,
    group: PlumbGroup
  ) {
    const uiGroup = jsPlumbInstance.getGroup(group.id);
    const uiNodes = group.children
      .map((childId) => {
        const isGroup = childId.includes('Group');
        if (isGroup) {
          return jsPlumbInstance.getGroup(childId).el;
        }
        return jsPlumbInstance.getManagedElement(childId);
      })
      .filter(Boolean);
    jsPlumbInstance.addToGroup(uiGroup, ...uiNodes);
  }

  addChildrenToGroup(group: PlumbGroup) {
    this.addNodesToGroup(this.jsPlumbInstance, group);
  }

  private getPlumbNodes(savePosition: boolean) {
    return this.elements
      .map((element) => {
        const plumbNode = <HTMLElement>(
          this.jsPlumbInstance.getManagedElement(element.instance.elementId)
        );
        const nodeJson = <PlumbNode>{ id: element.instance.elementId };

        if (savePosition) {
          nodeJson['style'] = {
            offsetLeft: plumbNode.offsetLeft,
            offsetTop: plumbNode.offsetTop,
          };
        }
        return nodeJson;
      })
      .filter(Boolean);
  }

  private getPlumbGroups(savePosition: boolean) {
    return this.groups
      .map((group) => {
        const plumbGroup = this.jsPlumbInstance.getGroup(
          group.instance.elementId
        );
        const groupEle = <HTMLElement>plumbGroup.el;

        const groupJson = <PlumbGroup>{
          id: group.instance.elementId,
          children: plumbGroup?.children.map((child) => child.el.id),
        };

        if (savePosition) {
          groupJson['style'] = {
            offsetLeft: groupEle.offsetLeft,
            offsetTop: groupEle.offsetTop,
          };
        }
        return groupJson;
      })
      .filter(Boolean);
  }

  clear() {
    this.elements = [];
    this.groups = [];
    this.jsPlumbInstance.reset();
  }

  removeNode(elementId: string) {
    const index = this.elements.findIndex(
      (x) => x.instance.elementId === elementId
    );
    this.elements.splice(index, 1);

    if (this.groups.length === 0 && this.elements.length === 0) {
      this.jsPlumbInstance.reset();
    }
  }

  removeGroup(elementId: string) {
    const plumbGroup = this.jsPlumbInstance.getGroup(elementId);

    plumbGroup.children.forEach((ele) => {
      this.removeNode(ele.el.id);
    });

    const index = this.groups.findIndex(
      (x) => x.instance.elementId === elementId
    );
    this.groups.splice(index, 1);
    if (this.groups.length === 0 && this.elements.length === 0) {
      this.jsPlumbInstance.reset();
    }
  }
}

function isDirtyCanvasFn(jsonObj: PlumbJson) {
  const hasGroup = jsonObj.groups.some((group) => {
    return document.getElementById(group.id);
  });
  if (hasGroup) {
    return true;
  }
  const hasElement = jsonObj.nodes.some((node) => {
    return document.getElementById(node.id);
  });
  return hasElement;
}

function getEndpointForConnection(
  elId: string,
  isGroup: boolean,
  isSource: boolean,
  jsPlumbInstance: BrowserJsPlumbInstance
) {
  const ele = isGroup
    ? jsPlumbInstance.getGroup(elId).el
    : jsPlumbInstance.getManagedElement(elId);
  const endpoints = jsPlumbInstance.getEndpoints(ele);
  return endpoints.find((ep) => (isSource ? ep.isSource : ep.isTarget));
}

function calculatePosition(group: UIGroup<HTMLElement>, element: HTMLElement) {
  const left = (group.el.offsetWidth - element.offsetWidth) / 2 + 10;

  let totalOffset = 0;
  let count = 1;
  for (let index = 0; index < group.children.length - 1; ++index) {
    const child = group.children[index];
    totalOffset += child.el.offsetHeight;
    ++count;
  }

  const top = totalOffset + 50 + count * 5;

  return { x: left, y: top };
}

function guidGenerator() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}
