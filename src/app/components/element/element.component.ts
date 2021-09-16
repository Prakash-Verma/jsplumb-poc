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
    const source: EndpointOptions = {
      endpoint: {
        type: 'Dot',
        options: { radius: 3 },
      },
      paintStyle: { fill: 'blue' },
      source: true,
      connector: { type: 'Flowchart', options: { cornerRadius: 4 } },
      connectorOverlays: [
        {
          type: 'PlainArrow',
          options: {
            location: 1,
            width: 6,
            length: 6,
          },
        },
      ],
    };
    this.jsPlumbInstance.addEndpoint(
      this.elementRef.nativeElement.firstChild,
      {
        anchor: 'Right',
        uuid: this.elementId + '_right',
      },
      source
    );

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
      this.elementRef.nativeElement.firstChild,
      { anchor: 'Left', uuid: this.elementId + '_left' },
      target
    );
  }
}
