import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { PlumbService } from '../../services/plumb.service';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class ElementComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(
    public elementRef: ElementRef,
    private plumbService: PlumbService
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.id = this.elementId;
    this.plumbService.addSourceElement(this.elementRef.nativeElement);
    // this.plumbService.addTargetElement(this.elementRef.nativeElement);
  }
}
