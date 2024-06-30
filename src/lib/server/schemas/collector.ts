import {
  enum_,
  type InferOutput,
  integer,
  maxValue,
  minValue,
  nullable,
  number,
  object,
  parse,
  pipe,
  string,
} from 'valibot';

/**
 * The type of the message sent.
 */
export enum MessageType {
  Response = 'response',
  Message = 'message',
}

/**
 * The category of the message sent.
 */
export enum MessageCategory {
  Inappropriate = 'inappropriate',
  Normal = 'normal',
  Important = 'important',
}

/**
 * The schema for the type of message sent.
 */
export const MessageTypeSchema = enum_(MessageType);

/**
 * The schema for the category of message sent.
 */
export const MessageCategoryEnum = enum_(MessageCategory);

/**
 * The schema for a message sent by the collector.
 */
export const CollectorSchema = object({
  type: MessageTypeSchema,
  category: MessageCategoryEnum,
  levelImportance: pipe(number(), integer(), minValue(1), maxValue(5)),
  subject: string(),
  intent: string(),
  information: object({
    symptom: nullable(string()),
    onset: nullable(string()),
    details: nullable(string()),
    extraInformation: nullable(string()),
  }),
  relatedMessageId: nullable(string()),
});

/**
 * The parsing function for the generator's return schema.
 */
export const parseCollectorSchemaArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(CollectorSchema, jsonData);
};

export type CollectorSchemaType = InferOutput<typeof CollectorSchema>;
