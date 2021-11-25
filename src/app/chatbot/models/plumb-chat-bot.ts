import { PlumbConnection, PlumbNode } from 'src/app/services/utils';
import { Interaction } from './interaction';
import { InteractionRouteModel } from './interaction-route';

export interface PlumbInteractionGroup extends PlumbNode {
  children: string[];
  interaction: Interaction;
}

export interface PlumbRoutingRuleNode extends PlumbNode {
  interactionRouteModel: InteractionRouteModel;
}

export interface PlumbChatBotJson {
  groups: PlumbInteractionGroup[];
  nodes: PlumbRoutingRuleNode[];
  connections: PlumbConnection[];
}
