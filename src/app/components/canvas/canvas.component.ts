import {
  Component,
  ComponentRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import {
  PlumbGroup,
  PlumbNode,
  PlumbService,
} from '../../services/plumb.service';
import { ElementComponent } from '../element/element.component';
import { GroupComponent } from '../group/group.component';

const elementPrefix = 'Element';
const groupPrefix = 'Group';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  private elements: ComponentRef<ElementComponent>[] = [];
  private groups: ComponentRef<GroupComponent>[] = [];

  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;
  @ViewChild('container') containerRef!: ElementRef;

  constructor(private plumbService: PlumbService) {}

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.containerRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  addElement() {
    const id = `${elementPrefix} ${this.elements.length + 1}`;
    const element = this.plumbService.addElement(id);
    this.elements.push(element);
  }

  addGroup() {
    const id = `${groupPrefix} ${this.groups.length + 1}`;
    const group = this.plumbService.addGroup(id, this.groups.length === 0);
    this.groups.push(group);
  }

  saveJsGram() {
    const plumbGroups = this.getPlumbGroups(this.plumbService.jsPlumbInstance);
    const plumbNodes = this.getPlumbNodes(this.plumbService.jsPlumbInstance);

    this.plumbService.createAndSaveJson(plumbGroups, plumbNodes);
  }

  private getPlumbNodes(jsPlumbInstance: BrowserJsPlumbInstance) {
    return this.elements
      .map((element) => {
        const plumbNode = <HTMLElement>(
          jsPlumbInstance.getManagedElement(element.instance.elementId)
        );
        return <PlumbNode>{
          id: element.instance.elementId,
          style: {
            offsetLeft: plumbNode.offsetLeft,
            offsetTop: plumbNode.offsetTop,
          },
        };
      })
      .filter(Boolean);
  }

  private getPlumbGroups(jsPlumbInstance: BrowserJsPlumbInstance) {
    return this.groups
      .map((group) => {
        const plumbGroup = jsPlumbInstance.getGroup(group.instance.elementId);
        const groupEle = <HTMLElement>plumbGroup.el;

        return <PlumbGroup>{
          id: group.instance.elementId,
          style: {
            offsetLeft: groupEle.offsetLeft,
            offsetTop: groupEle.offsetTop,
          },
          children: plumbGroup?.children.map((child) => child.el.id),
        };
      })
      .filter(Boolean);
  }

  clear() {
    this.elements = [];
    this.groups = [];
    this.plumbService.jsPlumbInstance.reset();
  }

  ReCreate() {
    const data = this.plumbService.recreate();
    if (!data) {
      return;
    }
    this.groups = data.groups;
    this.elements = data.nodes;
  }
}
