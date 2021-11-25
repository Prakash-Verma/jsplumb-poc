import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { PlumbService } from '../../services/plumb.service';
import { mock_interactions } from '../../chatbot/mock-data/mock-interaction';
import { mock_meeting_bot_interactions } from '../../chatbot/mock-data/mock-meeting_interactions';
import { mock_meeting_bot_routing } from '../../chatbot/mock-data/mock-meeting-bot-routing';
import { Interaction } from 'src/app/chatbot/models/interaction';
import { BotRoutes } from 'src/app/chatbot/models/interaction-route';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent {
  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;
  @ViewChild('container') containerRef!: ElementRef;

  constructor(
    private plumbService: PlumbService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.containerRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
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

  addRoutingRule() {
    this.plumbService.addRoutingRule();
  }

  ReCreate() {
    this.plumbService.recreate();
  }

  ReCreateBot() {
    this.recreateBot(mock_interactions, mock_meeting_bot_routing);
  }

  ReCreateMeetingBot() {
    this.recreateBot(mock_meeting_bot_interactions, mock_meeting_bot_routing);
  }

  private recreateBot(
    mockInteractions: Interaction[],
    mockBotRoutes: BotRoutes[]
  ) {
    const interactions: Interaction[] = JSON.parse(
      JSON.stringify(mockInteractions)
    );
    const botRoutes: BotRoutes[] = JSON.parse(JSON.stringify(mockBotRoutes));
    this.plumbService.recreateWithChatbotData(interactions, botRoutes);
  }
}
