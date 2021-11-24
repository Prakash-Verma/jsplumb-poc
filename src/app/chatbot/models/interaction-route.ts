export interface BotRoutes{
  otherwise_route? : {slug : string},
  interaction: {slug: string},
  interaction_routes : InteractionRouteModel[]
}

export interface InteractionRouteModel {
    id?: number;
    to_interaction_slug?: string;
    order?: number;
    _destroy?: boolean;
    interaction_route_rules?: Array<InteractionRouteRules>;
  }

export interface InteractionRouteRules{

}