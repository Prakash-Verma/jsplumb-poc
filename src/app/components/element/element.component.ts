import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { EndpointOptions } from '@jsplumb/core';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class ElementComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(public elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.addSourceElement();
    this.addTargetElement();
  }

  private addSourceElement() {
    const source: EndpointOptions = {
      endpoint: {
        type: 'Dot',
        options: { radius: 3 },
      },
      paintStyle: { fill: 'blue' },
      source: true,
    };
    this.jsPlumbInstance.addEndpoint(
      this.elementRef.nativeElement,
      {
        anchor: 'Right',
        uuid: this.elementId + '_right',
      },
      source
    );
  }

  private addTargetElement() {
    const target: EndpointOptions = {
      endpoint: {
        type: 'Dot',
        options: {
          radius: 3,
          cssClass: 'target-connection',
        },
      },
      paintStyle: { fill: 'blue' },
      target: true,
      maxConnections: 10,
    };

    this.jsPlumbInstance.addEndpoint(
      this.elementRef.nativeElement,
      { anchor: 'Left', uuid: this.elementId + '_left' },
      target
    );
  }
}
