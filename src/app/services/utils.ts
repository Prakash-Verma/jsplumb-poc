import {
  ComponentFactoryResolver,
  ComponentRef,
  ViewContainerRef,
} from '@angular/core';

import { ConnectorMenuComponent } from '../components/connector-menu/connector-menu.component';
import { ElementComponent } from '../components/element/element.component';
import { GroupComponent } from '../components/group/group.component';

export function getElementComponent(
  factoryResolver: ComponentFactoryResolver,
  containerRef: ViewContainerRef
) {
  const factory = factoryResolver.resolveComponentFactory(ElementComponent);
  return containerRef.createComponent<ElementComponent>(factory);
}

export function getGroupComponent(
  factoryResolver: ComponentFactoryResolver,
  containerRef: ViewContainerRef
) {
  const factory = factoryResolver.resolveComponentFactory(GroupComponent);
  return containerRef.createComponent<GroupComponent>(factory);
}

export function getConnectorMenuComponent(
  factoryResolver: ComponentFactoryResolver,
  containerRef: ViewContainerRef
) {
  const factory = factoryResolver.resolveComponentFactory(
    ConnectorMenuComponent
  );
  return containerRef.createComponent<ConnectorMenuComponent>(factory);
}

export interface PlumbNode {
  id: string;
  style?: {
    offsetLeft: number;
    offsetTop: number;
  };
}

export interface PlumbGroup extends PlumbNode {
  children: string[];
}

export interface PlumbConnection {
  connectionId?: string;
  source: { id: string; isGroup: boolean };
  target: { id: string; isGroup: boolean };
}

export interface PlumbJson {
  groups: PlumbGroup[];
  nodes: PlumbNode[];
  connections: PlumbConnection[];
}

export type ElementComponentRef = ComponentRef<ElementComponent>;

export type GroupComponentRef = ComponentRef<GroupComponent>;
