import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.jsPlumbInstance.addGroup({
      el: this.elementRef.nativeElement.firstChild,
      id: this.elementId,
      droppable: true,
    });
  }
}
