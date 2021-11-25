export interface RoutingRuleTarget {
  targetId: string;
  isRoutingRuleTarget: boolean;
  ruleId?: number;
  order?: number;
}

export interface RoutingNodes {
  interactionId: string;
  targetId: string;
  nodeRuleId: string;
  order: number;
}
