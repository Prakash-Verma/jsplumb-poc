export interface BotRoutes {
  otherwise_route?: { slug: string };
  interaction: { slug: string };
  interaction_routes: InteractionRouteModel[];
}

export interface InteractionRouteModel {
  id?: number;
  to_interaction_slug?: string;
  order?: number;
  _destroy?: boolean;
  interaction_route_rules?: Array<InteractionRouteRules>;
}

export interface InteractionRouteRules {
  id: number;
  rule_type: string;
  match_type: string;
  order: number;
  match_content: string;
  contact_field_id: string;
  contact_field_type: string;
  interaction: { slug: string };
}
