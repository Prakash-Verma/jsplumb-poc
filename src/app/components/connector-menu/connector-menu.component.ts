import { Component, ComponentRef, ElementRef, Input } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { PlumbService } from '../../services/plumb.service';

import { GroupComponent } from '../group/group.component';

@Component({
  selector: 'app-connector-menu',
  templateUrl: './connector-menu.component.html',
  styleUrls: ['./connector-menu.component.scss'],
})
export class ConnectorMenuComponent {
  @Input() parentElementId!: string;
  @Input() jsPlumbInstance!: BrowserJsPlumbInstance;

  constructor(
    public elementRef: ElementRef,
    private plumbService: PlumbService
  ) {}

  deleteConnector() {
    const currentConnection = this.getCurrentConnection();
    if (currentConnection) {
      this.jsPlumbInstance.deleteConnection(currentConnection);
    }
  }

  private getCurrentConnection() {
    const connections = this.jsPlumbInstance.connections;
    const currentConnection = connections.find(
      (c) => c.source.id === this.parentElementId
    );
    return currentConnection;
  }

  createGroup() {
    const { sourceOrElementGroupId, targetGroupId } =
      this.getOldSourceAndTargetIds();
    const { group, element } = this.addIntermediateGroup();

    setTimeout(() => {
      const { plumbGroupId, plumbElementId } = this.addElementToGroup(
        group,
        element
      );
      this.deleteConnector();

      this.connectWithIntermediateGroup(
        sourceOrElementGroupId,
        plumbGroupId,
        plumbElementId,
        targetGroupId
      );

      this.positionNewGroup(group);
    }, 0);
  }

  private positionNewGroup(group: ComponentRef<GroupComponent>) {
    const offsetLeft = this.elementRef.nativeElement.style.left;
    const offsetTop = this.elementRef.nativeElement.style.top;

    group.location.nativeElement.style.left =
      parseInt(offsetLeft.replace('px', '')) - 100 + 'px';
    group.location.nativeElement.style.top =
      parseInt(offsetTop.replace('px', '')) - 50 + 'px';
  }

  private connectWithIntermediateGroup(
    sourceOrElementGroupId: string,
    plumbGroupId: string,
    plumbElementId: string,
    targetGroupId: string
  ) {
    const newConnection1 = {
      source: {
        id: sourceOrElementGroupId,
        isGroup: sourceOrElementGroupId.includes('Group'),
      },
      target: { id: plumbGroupId, isGroup: true },
    };
    this.plumbService.createSingleConnection(newConnection1);

    const newConnection2 = {
      source: { id: plumbElementId, isGroup: false },
      target: { id: targetGroupId, isGroup: true },
    };
    this.plumbService.createSingleConnection(newConnection2);
  }

  private addElementToGroup(group: any, element: any) {
    const plumbGroup = this.jsPlumbInstance.getGroup(group.instance.elementId);
    const plumbElement = this.jsPlumbInstance.getManagedElement(
      element.instance.elementId
    );
    this.jsPlumbInstance.addToGroup(plumbGroup, plumbElement);
    return { plumbGroupId: plumbGroup.id, plumbElementId: plumbElement.id };
  }

  private getOldSourceAndTargetIds() {
    const currConnection = this.getCurrentConnection();
    const sourceOrElementGroupId: string = currConnection?.source.id;
    const targetGroupId: string = currConnection?.target.id;
    return { sourceOrElementGroupId, targetGroupId };
  }

  private addIntermediateGroup() {
    const group = this.plumbService.addGroup(undefined);
    const element = this.plumbService.addElement();
    return { group, element };
  }
}
