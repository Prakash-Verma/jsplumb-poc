import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { PlumbService } from '../../services/plumb.service';
import { mock_interactions } from '../../chatbot/mock-data/mock-interaction';
import { mock_meeting_bot_interactions } from '../../chatbot/mock-data/mock-meeting_interactions';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;
  @ViewChild('container') containerRef!: ElementRef;

  constructor(private plumbService: PlumbService) {}

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.containerRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  addElement() {
    this.plumbService.addElement();
  }

  addGroup() {
    this.plumbService.addGroup(undefined);
  }

  saveJsGram() {
    this.plumbService.createAndSaveJson();
  }

  saveJsGramNodeOnly() {
    this.plumbService.createAndSaveJson(false);
  }

  clear() {
    this.plumbService.clear();
  }

  ReCreate() {
    this.plumbService.recreate();
  }

  ReCreateBot() {
    this.plumbService.recreateWithChatbotData(mock_interactions);
  }

  ReCreateMeetingBot() {
    this.plumbService.recreateWithChatbotData(mock_meeting_bot_interactions);
  }

}
