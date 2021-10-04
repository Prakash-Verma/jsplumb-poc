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

  private getPlumbNodes(
    jsPlumbInstance: BrowserJsPlumbInstance,
    savePosition = true
  ) {
    return this.elements
      .map((element) => {
        const plumbNode = <HTMLElement>(
          jsPlumbInstance.getManagedElement(element.instance.elementId)
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

  private getPlumbGroups(
    jsPlumbInstance: BrowserJsPlumbInstance,
    savePosition = true
  ) {
    return this.groups
      .map((group) => {
        const plumbGroup = jsPlumbInstance.getGroup(group.instance.elementId);
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

  saveJsGramNodeOnly() {
    const plumbGroups = this.getPlumbGroups(
      this.plumbService.jsPlumbInstance,
      false
    );
    const plumbNodes = this.getPlumbNodes(
      this.plumbService.jsPlumbInstance,
      false
    );

    this.plumbService.createAndSaveJson(plumbGroups, plumbNodes);
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
