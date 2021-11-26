import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { FlowchartConnector } from '@jsplumb/connector-flowchart';
import { EndpointOptions } from '@jsplumb/core';
import { ConnectorOptions } from '@jsplumb/common';
import { ElementNode } from 'src/app/models/element';
import { CanvasService } from 'src/app/services/canvas.service';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
})
export class ElementComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() elementNode!: ElementNode;

  constructor(
    public elementRef: ElementRef,
    private canvasService: CanvasService
  ) {}

  ngAfterViewInit() {
    this.canvasService.setLocation(this.elementRef, this.elementNode);
    this.addSourceElement();
    this.addTargetElement();
  }

  private addSourceElement() {
    const connectorOpt: ConnectorOptions = {
      stub: 0,
      gap: 0,
      cssClass: `.connector {stroke: 'red', strokeWidth: 1}`,
      hoverClass: '.connector hover{}',
    };
    const source: EndpointOptions = {
      endpoint: 'Dot',
      paintStyle: { fill: 'blue' },
      source: true,
      connector: { type: FlowchartConnector.type, options: connectorOpt },
      maxConnections: 10,
      connectorStyle: { stroke: '#b731a9', strokeWidth: 1 },
      connectorOverlays: [
        { type: 'Arrow', options: { location: 1, id: '', cssClass: '{}' } },
      ],
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
