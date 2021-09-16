import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements AfterViewInit {
  @Input() group!: Element;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;
  @ViewChild('group') container!: HTMLElement;

  constructor() {}

  ngAfterViewInit() {
    console.log('From group: ', this.container);
    this.jsPlumbInstance.addGroup({
      el: this.group,
      id: this.group.id,
      droppable: true,
    });
  }
}
