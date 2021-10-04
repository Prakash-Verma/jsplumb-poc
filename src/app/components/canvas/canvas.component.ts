import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { PlumbService } from '../../services/plumb.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;
  @ViewChild('container') containerRef!: ElementRef;

  constructor(private plumbService: PlumbService) {}

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.containerRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  addElement() {
    this.plumbService.addElement();
  }

  addGroup() {
    this.plumbService.addGroup();
  }

  saveJsGram() {
    this.plumbService.createAndSaveJson();
  }

  saveJsGramNodeOnly() {
    this.plumbService.createAndSaveJson(false);
  }

  clear() {
    this.plumbService.clear();
  }

  ReCreate() {
    this.plumbService.recreate();
  }
}
