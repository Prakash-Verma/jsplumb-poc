import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { InteractionRouteModel } from 'src/app/chatbot/models/interaction-route';

import { PlumbService } from '../../services/plumb.service';
@Component({
  selector: 'app-routing-rule',
  templateUrl: './routing-rule.component.html',
  styleUrls: ['./routing-rule.component.scss'],
})
export class RoutingRuleComponent {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() interactionRouteModel!: InteractionRouteModel;

  constructor(
    public elementRef: ElementRef,
    private plumbService: PlumbService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.id = this.elementId;
    this.plumbService.addSourceElement(
      this.elementRef.nativeElement,
      '#0f8842'
    );
    // this.plumbService.addTargetElement(this.elementRef.nativeElement);
  }

  deleteNode() {
    this.jsPlumbInstance.removeAllEndpoints(this.elementRef.nativeElement);
    this.jsPlumbInstance._removeElement(this.elementRef.nativeElement);
    this.plumbService.removeNode(this.elementId);
  }
}
