import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';
import { EVENT_GROUP_MEMBER_ADDED, UIGroup } from '@jsplumb/core';
import { PointXY } from '@jsplumb/util';

import { ElementComponent } from '../components/element/element.component';
import { GroupComponent } from '../components/group/group.component';

@Injectable({
  providedIn: 'root',
})
export class PlumbService {
  private containerRef: ViewContainerRef | undefined;
  jsPlumbInstance: BrowserJsPlumbInstance | undefined;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private cd: ApplicationRef
  ) {}

  public initializeJsInstance(rootElementRef: ElementRef) {
    this.jsPlumbInstance = newInstance({
      container: rootElementRef.nativeElement,
    });

    this.setHandlers();
  }

  public setContainer(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
  }

  public addElement(elementId: string) {
    if (!this.containerRef) {
      throw new Error('Root container not initialized');
    }

    if (!this.jsPlumbInstance) {
      throw new Error('jsPlumbInstance is not yet set');
    }

    const factory =
      this.factoryResolver.resolveComponentFactory(ElementComponent);
    const componentRef =
      this.containerRef.createComponent<ElementComponent>(factory);
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    return componentRef;
  }

  public addGroup(elementId: string) {
    if (!this.containerRef) {
      throw new Error('Root container not initialized');
    }

    if (!this.jsPlumbInstance) {
      throw new Error('jsPlumbInstance is not yet set');
    }

    const factory =
      this.factoryResolver.resolveComponentFactory(GroupComponent);
    const componentRef =
      this.containerRef.createComponent<GroupComponent>(factory);
    componentRef.instance.elementId = elementId;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
    return componentRef;
  }

  private setHandlers() {
    if (!this.jsPlumbInstance) {
      throw new Error('jsPlumbInstance is not yet set');
    }

    this.jsPlumbInstance.bind(
      EVENT_GROUP_MEMBER_ADDED,
      (params: {
        group: UIGroup;
        el: any;
        pos: PointXY;
        sourceGroup?: UIGroup;
      }) => {
        const element = params.el;
        const currentGroup = params.group;
        this.adjustGroupWidth(element, currentGroup);
        this.setElementPositionInGroup(currentGroup, element, params);
        this.adjustGroupHeight(element, currentGroup);
        params.group.instance.repaintEverything();

        this.jsPlumbInstance?.setSuspendDrawing(false, true);
        this.cd.tick();
      }
    );
  }

  private adjustGroupWidth(element: any, currentGroup: UIGroup<any>) {
    let maxWidth = 0;
    currentGroup.children.forEach((child) => {
      if (child.el.offsetWidth > maxWidth) {
        maxWidth = child.el.offsetWidth;
      }
    });

    if (currentGroup.el.offsetWidth < maxWidth + 10) {
      currentGroup.el.style.width = maxWidth + 10 + 'px';
    }
  }

  private adjustGroupHeight(element: any, currentGroup: UIGroup<any>) {
    const bottomSpace = parseInt(
      getComputedStyle(element).bottom.replace('px', '')
    );
    if (bottomSpace <= 0) {
      currentGroup.el.style.height =
        currentGroup.el.offsetHeight + Math.abs(bottomSpace) + 'px';
    }
  }

  private setElementPositionInGroup(
    currentGroup: UIGroup<any>,
    element: any,
    params: {
      group: UIGroup;
      el: any;
      pos: PointXY;
      sourceGroup?: UIGroup<any> | undefined;
    }
  ) {
    const position = calculatePosition(currentGroup.el, element, params);
    this.jsPlumbInstance?.setPosition(element, position);
  }
}
function calculatePosition(
  groupEle: any,
  element: any,
  params: {
    group: UIGroup;
    el: any;
    pos: PointXY;
    sourceGroup?: UIGroup<any> | undefined;
  }
) {
  const left = (groupEle.offsetWidth - element.offsetWidth) / 2; // + 'px';

  // element.style.left = left + 'px';
  let totalOffset = 0;
  let count = 1;
  for (let index = 0; index < params.group.children.length - 1; ++index) {
    const child = params.group.children[index];
    totalOffset += child.el.offsetHeight;
    ++count;
  }

  const top = totalOffset + count * 5; // + 'px';

  return { x: left, y: top };
}
