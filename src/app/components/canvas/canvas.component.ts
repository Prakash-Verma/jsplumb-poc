import {
  Component,
  ComponentRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

import { PlumbService } from '../../services/plumb.service';
import { ElementComponent } from '../element/element.component';
import { GroupComponent } from '../group/group.component';
import { ChangeDetectorRef } from '@angular/core';
import { CanvasService } from 'src/app/services/canvas.service';
import {
  ELEMENT_POSITIONS,
  GROUP_POSITIONS,
} from 'src/app/constants/constants';

const elementPrefix = 'Element';
const groupPrefix = 'Group';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  private elements: ComponentRef<ElementComponent>[] = [];
  private groups: ComponentRef<GroupComponent>[] = [];

  @ViewChild('customElements', { static: true, read: ViewContainerRef })
  customElementsContainerRef!: ViewContainerRef;
  @ViewChild('container') containerRef!: ElementRef;

  constructor(
    private plumbService: PlumbService,
    private cdRef: ChangeDetectorRef,
    private canvasService: CanvasService
  ) {}

  ngOnInit() {
    this.fillFromJson();
  }

  ngAfterViewInit() {
    this.plumbService.initializeJsInstance(this.containerRef);
    this.plumbService.setContainer(this.customElementsContainerRef);
    this.plumbService.setRootViewContainerRef(this.customElementsContainerRef);
    this.createCanvasNodes();
    this.cdRef.detectChanges();
  }

  public createCanvasNodes() {
    this.canvasService.elementNodes.forEach((node) => {
      this.plumbService.addElement(node);
    });
    this.canvasService.groupNodes.forEach((node) => {
      this.plumbService.addGroup(node);
    });
    setTimeout(() => {
      this.canvasService.connections.forEach((connection) => {
        this.plumbService.addConnection(connection);
      });
    }, 0);
  }

  addElement() {
    const id = `${elementPrefix} ${this.elements.length + 1}`;
    const element = this.plumbService.addElement({
      id,
      top: ELEMENT_POSITIONS.TOP,
      left: ELEMENT_POSITIONS.LEFT,
    });
    this.elements.push(element);
  }

  addGroup() {
    const id = `${groupPrefix} ${this.groups.length + 1}_${[
      Math.random().toString(16).slice(2, 8),
    ]}`;
    const group = this.plumbService.addGroup({
      id,
      top: GROUP_POSITIONS.TOP,
      left: GROUP_POSITIONS.LEFT,
    });
    this.groups.push(group);
  }

  createJson() {
    const container = this.customElementsContainerRef.element.nativeElement
      .parentNode;
    const elementNodes = [...container.querySelectorAll('.element-node')].map(
      (node: HTMLElement) => {
        debugger;
        return {
          id: node.id,
          top: node.parentElement?.offsetTop,
          left: node.parentElement?.offsetLeft,
        };
      }
    );

    const groupNodes = [...container.querySelectorAll('.group-node')].map(
      (node: HTMLElement) => {
        debugger;
        return {
          id: node.id,
          top: node.offsetTop,
          left: node.offsetLeft,
        };
      }
    );

    const connections = this.plumbService.jsPlumbInstance?.connections.map(
      (conn) => ({ uuids: conn.getUuids() })
    );

    const json = JSON.stringify({
      elementNodes,
      groupNodes,
      connections: connections,
    });

    console.log(json);
  }

  fillFromJson() {
    const data: any = {
      elementNodes: [
        { id: 'Element 3', top: 150, left: 503 },
        { id: 'Element 2', top: 186, left: 250 },
        { id: 'Element 1', top: 97, left: 184 },
      ],
      groupNodes: [
        { id: 'Group 10', top: 389, left: 560 },
        { id: 'Group 11', top: 372, left: 52 },
        { id: 'Group 1_452de2', top: 568, left: 347 },
        { id: 'Group 1_1d51ff', top: 224, left: 570 },
      ],
      connections: [
        { uuids: ['Element 1_right', 'Element 2_left'] },
        { uuids: ['Element 2_right', 'Element 3_left'] },
        { uuids: ['Element 2_right', 'Group 10_left'] },
        { uuids: ['Element 2_right', 'Group 11_left'] },
        { uuids: ['Group 11_right', 'Group 10_left'] },
        { uuids: ['Group 11_right', 'Group 1_452de2_left'] },
        { uuids: ['Element 3_right', 'Group 1_1d51ff_left'] },
      ],
    };

    this.canvasService.groupNodes = data.groupNodes;
    this.canvasService.elementNodes = data.elementNodes;
    this.canvasService.connections = data.connections;
  }
}
