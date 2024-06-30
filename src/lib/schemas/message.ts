import {
  array,
  enum_,
  type InferOutput,
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  string,
  transform,
} from 'valibot';

import { MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH, MessageRole } from '$utils/message';

/**
 * Validates the content of a message to or from the assistant.
 */
export const AssistantMessageContentSchema = pipe(
  string('Veuillez saisir un message valide.'),
  transform((input) => input.trim()),
  minLength(MESSAGE_MIN_LENGTH, 'Le message doit contenir au moins 1 caractère.'),
  maxLength(MESSAGE_MAX_LENGTH, 'Le message doit contenir au maximum 4000 caractères.'),
);

/**
 * Validates the structure of a new message to the assistant.
 */
export const AssistantMessageSchema = object({
  content: AssistantMessageContentSchema,
  context: optional(pipe(string(), minLength(1), maxLength(2000))),
  messages: array(
    object(
      {
        role: enum_(MessageRole),
        content: pipe(string(), minLength(MESSAGE_MIN_LENGTH), maxLength(MESSAGE_MAX_LENGTH)),
      },
      'Les messages ne semblent pas être valides.',
    ),
    'Les messages ne semblent pas être valides.',
  ),
});

export type AssistantMessageContentSchemaType = InferOutput<typeof AssistantMessageContentSchema>;
export type AssistantMessageSchemaType = InferOutput<typeof AssistantMessageSchema>;
