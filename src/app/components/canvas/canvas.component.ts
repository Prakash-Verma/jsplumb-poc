import {
  Component,
  ComponentRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PlumbService } from 'src/app/services/plumb.service';

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

  constructor(
    private elementRef: ElementRef,
    private plumbService: PlumbService
  ) {}

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.elementRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  addElement() {
    const id = `${elementPrefix} ${this.elements.length + 1}`;
    const element = this.plumbService.addElement(id);
    this.elements.push(element);
  }

  addGroup() {
    const id = `${groupPrefix} ${this.groups.length + 1}`;
    const group = this.plumbService.addGroup(id);
    this.groups.push(group);
  }
}
