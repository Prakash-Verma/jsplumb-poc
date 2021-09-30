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
  UIGroup,
} from '@jsplumb/core';
import { PointXY } from '@jsplumb/util';

import { ElementComponent } from '../components/element/element.component';
import { GroupComponent } from '../components/group/group.component';
import { NotificationService } from '../components/notification/notification.service';

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

  public addElement(elementId: string) {
    const factory =
      this.factoryResolver.resolveComponentFactory(ElementComponent);
    const componentRef =
      this.containerRef.createComponent<ElementComponent>(factory);
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    return componentRef;
  }

  public addGroup(elementId: string, isFirstElement: boolean) {
    const factory =
      this.factoryResolver.resolveComponentFactory(GroupComponent);
    const componentRef =
      this.containerRef.createComponent<GroupComponent>(factory);
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    componentRef.instance.needSource = isFirstElement;
    componentRef.instance.needTarget = !isFirstElement;
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
          // this.jsPlumbInstance.repaint(params.group.el);
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

    if (group.el.offsetWidth < maxWidth + 10) {
      group.el.style.width = maxWidth + 10 + 'px';
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

  public addSourceElement(nativeElement: HTMLElement) {
    const source: EndpointOptions = {
      endpoint: 'Dot',
      paintStyle: { fill: '#fff', stroke: '#b731a9' },
      source: true,
      connectorStyle: { stroke: '#b731a9', strokeWidth: 1 },
      connectorOverlays: [
        { type: 'PlainArrow', options: { location: 1, width: 12, length: 10 } },
      ],
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
      target: true,
    };

    this.jsPlumbInstance.addEndpoint(nativeElement, { anchor: 'Left' }, target);
  }

  public createAndSaveJson(plumbGroups: PlumbGroup[], plumbNodes: PlumbNode[]) {
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

    const nodes = jsonObj.nodes.map((node) => this.addElement(node.id));

    const groups = jsonObj.groups.map((group, index) => {
      const component = this.addGroup(group.id, index === 0);
      component.location.nativeElement.style.left =
        group.style.offsetLeft + 'px';
      component.location.nativeElement.style.top = group.style.offsetTop + 'px';

      setTimeout(() => {
        this.addNodesToGroup(this.jsPlumbInstance, group);
      }, 0);
      return component;
    });

    setTimeout(() => {
      this.createConnections(jsonObj, this.jsPlumbInstance);

      container.style.opacity = '1';
      this.jsPlumbInstance.setSuspendDrawing(false);
    }, 0);

    return { groups, nodes };
  }

  private createConnections(
    jsonObj: PlumbJson,
    jsPlumbInstance: BrowserJsPlumbInstance
  ) {
    jsonObj.connections.forEach((conn) => {
      const srcEndpoint = getEndpointForConnection(
        conn.source.id,
        conn.source.isGroup,
        true,
        jsPlumbInstance
      );
      const targetEndpoint = getEndpointForConnection(
        conn.target.id,
        conn.target.isGroup,
        false,
        jsPlumbInstance
      );
      if (srcEndpoint && targetEndpoint) {
        jsPlumbInstance.connect({
          source: srcEndpoint,
          target: targetEndpoint,
        });
      }
    });
  }

  private addNodesToGroup(
    jsPlumbInstance: BrowserJsPlumbInstance,
    group: PlumbGroup
  ) {
    const uiGroup = jsPlumbInstance.getGroup(group.id);
    const uiNodes = group.children.map((child) =>
      jsPlumbInstance.getManagedElement(child)
    );
    jsPlumbInstance.addToGroup(uiGroup, ...uiNodes);
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
  const left = (group.el.offsetWidth - element.offsetWidth) / 2;

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

export interface PlumbNode {
  id: string;
  style: {
    offsetLeft: number;
    offsetTop: number;
  };
}

export interface PlumbGroup extends PlumbNode {
  children: string[];
}

interface PlumbConnection {
  connectionId: string;
  source: { id: string; isGroup: boolean };
  target: { id: string; isGroup: boolean };
}

interface PlumbJson {
  groups: PlumbGroup[];
  nodes: PlumbNode[];
  connections: PlumbConnection[];
}
