import {
  array,
  type InferOutput,
  maxLength,
  minLength,
  object,
  picklist,
  pipe,
  string,
  transform,
} from 'valibot';

export const AssistantMessageContentSchema = pipe(
  string(),
  transform((input) => input.trim()),
  minLength(1),
  maxLength(5000),
);

export const AssistantMessageSchema = object({
  content: AssistantMessageContentSchema,
  messages: array(
    object({
      role: pipe(string(), picklist(['assistant', 'user'])),
      content: pipe(string(), minLength(1), maxLength(5000)),
    }),
  ),
});

export type AssistantMessageContentSchemaType = InferOutput<typeof AssistantMessageContentSchema>;
export type AssistantMessageSchemaType = InferOutput<typeof AssistantMessageSchema>;
