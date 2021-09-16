import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
import { PlumbService } from 'src/app/services/plumb.service';

const elementPrefix = 'Element';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  elements: Element[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private plumbService: PlumbService
  ) {}

  ngAfterViewInit() {
    this.plumbService.setContainer(this.viewContainerRef);
  }

  addElement() {
    const element = document.createElement('div');
    element.id = `${elementPrefix} ${this.elements.length + 1}`;
    this.elements.push(element);
    this.plumbService.addElement(element);
  }
}
