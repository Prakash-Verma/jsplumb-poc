import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PlumbService } from 'src/app/services/plumb.service';

const elementPrefix = 'Element';
const groupPrefix = 'Group';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  private elements: Element[] = [];
  private groups: Element[] = [];

  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;

  constructor(private plumbService: PlumbService) {}

  ngAfterViewInit() {
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  addElement() {
    const element = document.createElement('div');
    element.id = `${elementPrefix} ${this.elements.length + 1}`;
    this.elements.push(element);
    this.plumbService.addElement(element);
  }

  addGroup() {
    const group = document.createElement('div');
    group.id = `${groupPrefix} ${this.groups.length + 1}`;

    this.groups.push(group);
    this.plumbService.addGroup(group);
  }
}
