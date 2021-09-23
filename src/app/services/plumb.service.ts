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

  constructor(private factoryResolver: ComponentFactoryResolver) {}

  public initializeJsInstance(rootElementRef: ElementRef) {
    this.jsPlumbInstance = newInstance({
      container: rootElementRef.nativeElement,
      connector: FlowchartConnector.type,
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
      paintStyle: { fill: 'blue' },
      source: true,
      connectorStyle: { stroke: '#99cb3a', strokeWidth: 2 },
      connectorOverlays: [{ type: 'PlainArrow', options: { location: 1 } }],
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
      paintStyle: { fill: 'blue' },
      target: true,
    };

    this.jsPlumbInstance.addEndpoint(nativeElement, { anchor: 'Left' }, target);
  }
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
