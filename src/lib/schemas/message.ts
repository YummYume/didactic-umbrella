import {
  array,
  enum_,
  type InferOutput,
  maxLength,
  minLength,
  object,
  pipe,
  string,
  transform,
} from 'valibot';

import { MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH, MessageRole } from '$utils/message';

/**
 * Validates the content of a message to or from the assistant.
 */
export const AssistantMessageContentSchema = pipe(
  string(),
  transform((input) => input.trim()),
  minLength(MESSAGE_MIN_LENGTH),
  maxLength(MESSAGE_MAX_LENGTH),
);

/**
 * Validates the structure of a new message to the assistant.
 */
export const AssistantMessageSchema = object({
  content: AssistantMessageContentSchema,
  messages: array(
    object({
      role: enum_(MessageRole),
      content: pipe(string(), minLength(MESSAGE_MIN_LENGTH), maxLength(MESSAGE_MAX_LENGTH)),
    }),
  ),
});

export type AssistantMessageContentSchemaType = InferOutput<typeof AssistantMessageContentSchema>;
export type AssistantMessageSchemaType = InferOutput<typeof AssistantMessageSchema>;
