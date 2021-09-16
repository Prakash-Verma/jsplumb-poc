import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';

import { ElementComponent } from '../components/element/element.component';
import { GroupComponent } from '../components/group/group.component';

@Injectable({
  providedIn: 'root',
})
export class PlumbService {
  private containerRef: ViewContainerRef | undefined;
  jsPlumbInstance: BrowserJsPlumbInstance | undefined;

  constructor(private factoryResolver: ComponentFactoryResolver) {}

  public setContainer(containerRef: ViewContainerRef) {
    this.containerRef = containerRef;
    this.jsPlumbInstance = newInstance({
      container: containerRef.element.nativeElement,
    });
  }

  public addElement(node: Element) {
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
    componentRef.instance.element = node;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
  }

  public addGroup(node: any) {
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
    componentRef.instance.group = node;
    componentRef.instance.jsPlumbInstance = this.jsPlumbInstance;
  }
}
