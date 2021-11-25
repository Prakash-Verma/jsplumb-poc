import { ComponentRef, Injectable } from '@angular/core';
import { RoutingRuleComponent } from 'src/app/components/routing-rule/routing-rule.component';
import { PlumbService } from 'src/app/services/plumb.service';
import { PlumbConnection, PlumbNode } from 'src/app/services/utils';
import { Interaction } from '../models/interaction';
import { BotRoutes } from '../models/interaction-route';
import {
  PlumbChatBotJson,
  PlumbInteractionGroup,
  PlumbRoutingRuleNode,
} from '../models/plumb-chat-bot';
import { RoutingNodes, RoutingRuleTarget } from '../models/routing-rule-target';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  constructor(private plumbService: PlumbService) {}

  recreateWithChatbotData(interactions: Interaction[], botRoutes: BotRoutes[]) {
    this.plumbService.clear();
    let offsetLeft = 20;
    const offsetTop = window.innerHeight / 3;

    this.plumbService.setSuspendDrawing(true);
    const jsonObj = this.createChatBotConnections(interactions, botRoutes);

    const groups = jsonObj.groups.map((group, i) => {
      const component = this.plumbService.addGroup(
        group.id,
        group.interaction,
        i + 1
      );
      component.location.nativeElement.style.left = offsetLeft + 'px';
      component.location.nativeElement.style.top = offsetTop + 'px';
      component.instance.ngOnInit();

      //const groupOffsetLeft = component.location.nativeElement.style.left;
      const groupOffsetHeight =
        component.instance.elementRef.nativeElement.offsetHeight;

      if (group.children.length)
        this.createRoutingRuleNodes(
          group,
          jsonObj,
          offsetLeft,
          offsetTop,
          groupOffsetHeight
        );

      offsetLeft += component.location.nativeElement.offsetWidth + 100;
      return component;
    });

    setTimeout(() => {
      //   const normalGroup: PlumbGroup[] = [];
      //   const groupWithNestedGroup: PlumbGroup[] = [];
      //   jsonObj.groups.forEach((g) => {
      //     const hasGroupAsChild = g.children.some((childId) =>
      //       childId.includes('Group')
      //     );
      //     if (hasGroupAsChild) {
      //       groupWithNestedGroup.push(g);
      //     } else {
      //       normalGroup.push(g);
      //     }
      //   });

      jsonObj.groups.forEach((group) => {
        this.plumbService.addChildrenToGroup(group);
      });
    }, 0);

    setTimeout(() => {
      this.plumbService.createConnections(jsonObj.connections);
      this.plumbService.setSuspendDrawing(false);
      this.plumbService.repaintEverything();
    }, 0);
  }

  private createRoutingRuleNodes(
    group: PlumbInteractionGroup,
    jsonObj: PlumbChatBotJson,
    offsetLeft: number,
    offsetTop: number,
    groupOffsetHeight: number
  ) {
    const chileNodes: PlumbRoutingRuleNode[] = [];
    let nodes: ComponentRef<RoutingRuleComponent>[] = [];
    let nodeOffsetTop = offsetTop + groupOffsetHeight;
    group.children.forEach((child) => {
      const chileNodes = jsonObj.nodes.filter((node) => node.id === child);

      nodes = nodes.concat(
        chileNodes.map((node) => {
          const component = this.plumbService.addRoutingRule(
            node.id,
            node.interactionRouteModel
          );
          component.location.nativeElement.style.left = offsetLeft + 'px';
          component.location.nativeElement.style.top = nodeOffsetTop + 'px';

          nodeOffsetTop +=
            component.instance.elementRef.nativeElement.offsetHeight + 2;

          return component;
        })
      );
    });
  }

  createChatBotConnections(
    interactions: Interaction[],
    botRoutes: BotRoutes[]
  ) {
    const jsonObj: PlumbChatBotJson = {
      nodes: [],
      groups: [],
      connections: [],
    };

    interactions.forEach((interaction, index) => {
      const sourceId = interaction?.slug;
      if (sourceId) {
        const routes: RoutingRuleTarget[] = this.getInteractionConnectionTarget(
          sourceId,
          index,
          interactions,
          botRoutes,
          interaction?.basic_route_slug
        );

        const childNodes: string[] = [];
        const routingNodes: RoutingNodes[] = [];

        let i = 0;
        let connectionSourceId = sourceId;
        let isGroup = true;
        const connections = routes.map((target) => {
          i++;
          if (target.isRoutingRuleTarget) {
            const nodeRuleId = this.getRoutingRuleNodeId(
              sourceId,
              target.interactionRouteModel?.id
            );
            routingNodes.push({
              interactionId: sourceId,
              targetId: target.targetId,
              nodeRuleId: nodeRuleId,
              order: target.interactionRouteModel?.order || -1,
              interactionRouteModel: target.interactionRouteModel,
            });
            connectionSourceId = nodeRuleId;
            isGroup = false;
          }
          return <PlumbConnection>{
            connectionId: 'conn' + index + '' + i,
            source: {
              id: connectionSourceId,
              isGroup: isGroup,
            },
            target: {
              id: target.targetId,
              isGroup: true,
            },
          };
        });
        jsonObj.connections = jsonObj.connections.concat(connections);
        const nodes = routingNodes.map((node) => {
          const nodeId = node.nodeRuleId;
          childNodes.push(nodeId);
          return <PlumbRoutingRuleNode>{
            id: nodeId,
            interactionRouteModel: node.interactionRouteModel,
          };
        });
        jsonObj.nodes = jsonObj.nodes.concat(nodes);

        jsonObj.groups.push(<PlumbInteractionGroup>{
          id: sourceId,
          interaction: interaction,
          children: childNodes,
        });
      }
    });

    return jsonObj;
  }

  private getRoutingRuleNodeId(
    interactionId: string,
    nodeRuleId?: number
  ): string {
    if (nodeRuleId) return nodeRuleId + '';
    return 'default_' + interactionId;
  }

  private getInteractionConnectionTarget(
    interaction_slug: string,
    index: number,
    interactions: Interaction[],
    botRoutes: BotRoutes[],
    basic_route_slug?: string
  ): RoutingRuleTarget[] {
    const targetRoutes: RoutingRuleTarget[] = [];
    const routingRules = botRoutes.find(
      (route) => route.interaction.slug === interaction_slug
    );
    if (basic_route_slug) {
      targetRoutes.push({
        targetId: basic_route_slug,
        isRoutingRuleTarget: false,
      });
    } else if (routingRules) {
      routingRules.interaction_routes?.forEach((route) => {
        const targetId = route.to_interaction_slug;
        if (targetId)
          targetRoutes.push(<RoutingRuleTarget>{
            targetId: targetId,
            isRoutingRuleTarget: true,
            interactionRouteModel: route,
          });
      });
      if (routingRules.otherwise_route?.slug)
        targetRoutes.push({
          targetId: routingRules.otherwise_route?.slug,
          isRoutingRuleTarget: true,
        });
      else {
        this.addNextInteractionAsTarget(
          interactions,
          index,
          targetRoutes,
          true
        );
      }
    } else if (interactions.length > index) {
      this.addNextInteractionAsTarget(interactions, index, targetRoutes, false);
    }
    return targetRoutes;
  }

  private addNextInteractionAsTarget(
    interactions: Interaction[],
    index: number,
    targetRoutes: RoutingRuleTarget[],
    isRoutingRuleTarget: boolean
  ) {
    const nextInteractionId = interactions[index + 1]?.slug;
    if (nextInteractionId)
      targetRoutes.push({
        targetId: nextInteractionId,
        isRoutingRuleTarget: isRoutingRuleTarget,
      });
  }
}
