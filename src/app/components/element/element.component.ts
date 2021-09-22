import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { FlowchartConnector } from '@jsplumb/connector-flowchart';
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
      endpoint: 'Dot',
      paintStyle: { fill: 'blue' },
      source: true,
      connector: FlowchartConnector.type,
      maxConnections: 10,
      connectorStyle: { stroke: '#99cb3a', strokeWidth: 2 },
      connectorOverlays: [{ type: 'Arrow', options: { location: 1 } }],
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
      endpoint: 'Dot',
      paintStyle: { fill: 'blue' },
      target: true,
      maxConnections: 10,
      connector: FlowchartConnector.type,
    };

    this.jsPlumbInstance.addEndpoint(
      this.elementRef.nativeElement,
      { anchor: 'Left', uuid: this.elementId + '_left' },
      target
    );
  }
}
