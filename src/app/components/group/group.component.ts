import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { ConnectorOptions } from '@jsplumb/common';
import { FlowchartConnector } from '@jsplumb/connector-flowchart';
import { EndpointOptions } from '@jsplumb/core';
import { ElementNode } from 'src/app/models/element';
import { CanvasService } from 'src/app/services/canvas.service';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() sourceGroup!: ElementRef;
  @Input() elementNode!: ElementNode;

  constructor(
    public elementRef: ElementRef,
    private canvasService: CanvasService
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.id = this.elementNode?.id;
    this.elementRef.nativeElement.classList.add('group-node');
    this.canvasService.setLocation(this.elementRef, this.elementNode);
    this.addGroupElement();
    this.addSourceElement();
    this.addTargetElement();
  }

  private addGroupElement() {
    this.jsPlumbInstance.addGroup({
      el: this.elementRef.nativeElement,
      id: this.elementNode.id,
      droppable: true,
      constrain: false,
      revert: false,
    });
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
      endpoint: {
        type: 'Dot',
        options: {
          radius: 5,
          cssClass: 'target-connection',
        },
      },
      paintStyle: { fill: 'blue' },
      target: true,
      maxConnections: 10,
    };

    this.jsPlumbInstance.addEndpoint(
      this.elementRef.nativeElement,
      { anchor: 'AutoDefault', uuid: this.elementId + '_left' },
      target
    );
  }
}
