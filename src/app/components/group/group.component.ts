import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { EndpointOptions } from '@jsplumb/core';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() sourceGroup!: ElementRef;

  constructor(public elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.addGroupElement();
    this.addSourceElement();
    this.addTargetElement();
  }

  private addGroupElement() {
    this.jsPlumbInstance.addGroup({
      el: this.elementRef.nativeElement,
      id: this.elementId,
      droppable: true,
      constrain: true,
    });
  }

  private addSourceElement() {
    const source: EndpointOptions = {
      endpoint: {
        type: 'Dot',
        options: { radius: 5 },
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
