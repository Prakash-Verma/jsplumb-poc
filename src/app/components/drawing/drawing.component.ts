import { AfterViewInit, Component, ViewContainerRef } from '@angular/core';
import { PlumbService } from 'src/app/services/plumb.service';

@Component({
  selector: 'app-drawing',
  template: '',
  styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
  constructor(
    private plumbService: PlumbService,
    private containerRef: ViewContainerRef
  ) {}

  ngAfterViewInit() {
    this.plumbService.setContainer(this.containerRef);
  }
}
