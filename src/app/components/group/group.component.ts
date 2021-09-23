import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { PlumbService } from '../../services/plumb.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() needSource = false;
  @Input() needTarget = true;

  constructor(
    public elementRef: ElementRef,
    private plumbService: PlumbService
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.id = this.elementId;
    this.addGroupElement();

    this.addSource();
    this.addTarget();
  }

  private addGroupElement() {
    this.jsPlumbInstance.addGroup({
      el: this.elementRef.nativeElement,
      id: this.elementId,
      droppable: true,
      constrain: false,
      revert: false,
    });
  }

  private addSource() {
    if (!this.needSource) {
      return;
    }
    this.plumbService.addSourceElement(this.elementRef.nativeElement);
  }

  private addTarget() {
    if (!this.needTarget) {
      return;
    }
    this.plumbService.addTargetElement(this.elementRef.nativeElement);
  }
}
