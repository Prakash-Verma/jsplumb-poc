import { interactionKind } from './interaction-kind';
import { interactionTypes } from './interaction-types';

export const interactionList = {
  question: {
    label: 'Questions',
    id: interactionTypes.question,
    items: [
      {
        question_type: 'single_choice',
        label: 'Single select',
        interaction_type: interactionTypes.question,
        icon_type: 'singlechoice-24',
      },
      {
        question_type: 'text',
        label: 'Text question',
        interaction_type: interactionTypes.question,
        icon_type: 'text-question-24',
      },
      {
        question_type: 'email',
        label: 'Email',
        interaction_type: interactionTypes.question,
        icon_type: 'email-24',
      },
      {
        question_type: 'number',
        label: 'Number',
        interaction_type: interactionTypes.question,
        icon_type: 'number-24',
      },
      {
        question_type: interactionKind.phone,
        label: 'Phone',
        interaction_type: interactionTypes.question,
        icon_type: 'phone-24',
      },
      {
        question_type: 'multi_choice',
        label: 'Multi select',
        interaction_type: interactionTypes.question,
        icon_type: 'mutichoice-24',
      },
      {
        question_type: 'datetime',
        label: 'Date & time',
        interaction_type: interactionTypes.question,
        icon_type: 'date-and-time-24-1',
      },
      {
        question_type: 'date',
        label: 'Date',
        interaction_type: interactionTypes.question,
        icon_type: 'date-24',
      },
      {
        question_type: 'time',
        label: 'Time',
        interaction_type: interactionTypes.question,
        icon_type: 'time-24',
      },
    ],
  },
  message: {
    label: 'Messages',
    id: interactionTypes.message,
    items: [
      {
        message_type: 'text_message',
        label: 'Text message',
        interaction_type: interactionTypes.message,
        icon_type: 'message-24',
      },
      {
        message_type: 'url',
        label: 'Url',
        interaction_type: interactionTypes.message,
        icon_type: 'url-24',
      },
      {
        message_type: 'image_message',
        label: 'Image',
        interaction_type: interactionTypes.message,
        icon_type: 'image-24',
      },
      {
        message_type: 'video_message',
        label: 'Video',
        interaction_type: interactionTypes.message,
        icon_type: 'video-24',
      },
      {
        message_type: 'document_message',
        label: 'Document',
        interaction_type: interactionTypes.message,
        icon_type: 'document-24',
      },
    ],
  },
  action: {
    label: 'Actions',
    id: interactionTypes.action,
    items: [
      {
        action_type: 'schedule',
        label: 'Schedule',
        interaction_type: interactionTypes.action,
        icon_type: 'schedule-24',
      },
      {
        action_type: 'end_conversation',
        label: 'End chat',
        interaction_type: interactionTypes.action,
        icon_type: 'end-chat-24',
      },
      {
        action_type: 'email_alert',
        label: 'Email alert',
        interaction_type: interactionTypes.action,
        icon_type: 'email-alert-24',
      },
      // {
      //   action_type: 'live_chat',
      //   label: 'Live chat',
      //   interaction_type: interactionTypes.action,
      //   icon_type: 'live-chat-24',
      // },
      {
        action_type: 'contact_status',
        label: 'Contact status',
        interaction_type: interactionTypes.action,
        icon_type: 'contact-status-24',
      },
    ],
  },
};
