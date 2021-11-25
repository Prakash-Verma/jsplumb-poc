import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
} from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { interactionKind } from 'src/app/constants/interaction-kind';
import { interactionList } from 'src/app/constants/interaction-list';
import { interactionTypes } from 'src/app/constants/interaction-types';
import { Interaction } from '../../chatbot/models/interaction';

import { PlumbService } from '../../services/plumb.service';
import { GroupOptions, AddGroupOptions } from '@jsplumb/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() elementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @Input() needSource = true;
  @Input() needTarget = true;
  @Input() interaction!: Interaction;
  @Input() index: number = 0;

  interactionKind = JSON.parse(JSON.stringify(interactionKind));
  interactionType = JSON.parse(JSON.stringify(interactionTypes));
  interactionList = JSON.parse(JSON.stringify(interactionList));

  currentDate = new Date();
  nextDay: number = 1;
  secondNextDay: number = 2;
  thirdNextDay: number = 3;

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
    this.addGroupElement();

    this.addSource();
    this.addTarget();
    if (this.interaction)
      this.interaction.label = this.getInteractionLabelAndIcon().label;
    this.getNextThreeDaysFromToday();
  }

  private addGroupElement(groupOptions?: GroupOptions) {
    const addGroupElOptions = {
      el: this.elementRef.nativeElement,
      id: this.elementId,
    };
    if (!groupOptions) {
      groupOptions = {
        orphan: true,
        constrain: true,
      };
    }
    const addGroupOptions: AddGroupOptions<Element> = {
      ...addGroupElOptions,
      ...groupOptions,
    };
    this.jsPlumbInstance.addGroup(addGroupOptions);
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

  deleteNode() {
    this.plumbService.removeGroup(this.elementId);
    this.jsPlumbInstance.removeGroup(this.elementId, true);
  }

  private getInteractionLabelAndIcon() {
    let label = '';
    let icon = '';
    this.interactionList[this.interaction.interaction_type].items.some(
      (question: any) => {
        // Adding label to interaction
        if (
          question[`${this.interaction.interaction_type}_type`] ===
          (<any>this.interaction)[`${this.interaction.interaction_type}_type`]
        ) {
          label = question.label;
          icon = question.icon_type;
          return true; // Breaking loop when found
        }
        return false;
      }
    );
    return { label: label, icon: icon };
  }

  private getNextThreeDaysFromToday() {
    const today = new Date();
    this.nextDay = today.setDate(today.getDate() + 1);
    this.secondNextDay = today.setDate(today.getDate() + 1);
    this.thirdNextDay = today.setDate(today.getDate() + 1);
  }
}
