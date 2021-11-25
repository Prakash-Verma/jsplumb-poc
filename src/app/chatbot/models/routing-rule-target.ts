import { InteractionRouteModel } from './interaction-route';

export interface RoutingRuleTarget {
  targetId: string;
  isRoutingRuleTarget: boolean;
  interactionRouteModel?: InteractionRouteModel;
}

export interface RoutingNodes {
  interactionId: string;
  targetId: string;
  nodeRuleId: string;
  order: number;
  interactionRouteModel?: InteractionRouteModel;
}
