import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { newInstance } from '@jsplumb/browser-ui';
import { DotEndpoint } from '@jsplumb/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('source', { read: ElementRef }) source!: ElementRef;
  @ViewChild('target', { read: ElementRef }) target!: ElementRef;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    const instance = newInstance({
      container: this.element.nativeElement,
    });

    instance.connect({
      source: this.source.nativeElement,
      target: this.target.nativeElement,
      // connector: StraightConnector.type,
      endpoint: {
        type: DotEndpoint.type,
        options: {
          radius: 10,
        },
      },
    });
  }
}
