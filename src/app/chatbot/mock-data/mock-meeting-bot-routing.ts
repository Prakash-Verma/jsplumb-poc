import { BotRoutes } from '../models/interaction-route';

export const mock_meeting_bot_routing: BotRoutes[] = [
  {
    otherwise_route: { slug: 'INT-8081530D44' },
    interaction: { slug: 'INT-D1EFB7643F' },
    interaction_routes: [
      {
        id: 118711,
        to_interaction_slug: 'INT-4D4AC86EBB',
        order: 0,
        interaction_route_rules: [
          {
            id: 5247,
            rule_type: 'current_answer',
            match_type: 'is_exactly_multi_choice',
            order: 1,
            match_content: '471992',
            contact_field_id: '',
            contact_field_type: '',
            interaction: { slug: 'INT-D1EFB7643F' },
          },
        ],
      },
      {
        id: 118712,
        to_interaction_slug: 'INT-E8EFD03B43',
        order: 1,
        interaction_route_rules: [
          {
            id: 5248,
            rule_type: 'current_answer',
            match_type: 'is_exactly_multi_choice',
            order: 1,
            match_content: '471993',
            contact_field_id: '',
            contact_field_type: '',
            interaction: { slug: 'INT-D1EFB7643F' },
          },
        ],
      },
    ],
  },
  {
    otherwise_route: undefined,
    interaction: { slug: 'INT-3E39A6FA2D' },
    interaction_routes: [
      {
        id: 118638,
        to_interaction_slug: 'int-6c0d92273d',
        order: 0,
        interaction_route_rules: [
          {
            id: 5246,
            rule_type: 'current_answer',
            match_type: 'is_after_time',
            order: 1,
            match_content: '04:00 am',
            contact_field_id: '',
            contact_field_type: '',
            interaction: { slug: 'INT-3E39A6FA2D' },
          },
        ],
      },
    ],
  },
];
