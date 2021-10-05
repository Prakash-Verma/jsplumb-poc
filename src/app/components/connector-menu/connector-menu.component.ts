import { Component, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-connector-menu',
  templateUrl: './connector-menu.component.html',
  styleUrls: ['./connector-menu.component.scss'],
})
export class ConnectorMenuComponent {
  @Input() parentElementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(public elementRef: ElementRef) {}

  deleteConnector() {
    const connections = this.jsPlumbInstance.connections;
    const currentConnection = connections.find(
      (c) => c.source.id === this.parentElementId
    );
    if (currentConnection) {
      this.jsPlumbInstance.deleteConnection(currentConnection);
    }
  }

  createGroup() {}
}
