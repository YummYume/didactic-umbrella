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

import { MessageCategory, MessageType } from '$server/utils/collector';

export const TypeMessageSchema = enum_(MessageType);
export const CategoryMessageSchema = enum_(MessageCategory);

/**
 * The schema for a message sent by the collector.
 */
export const CollectorSchema = object({
  type: TypeMessageSchema,
  category: CategoryMessageSchema,
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

export type CollectorSchemaType = InferOutput<typeof CollectorSchema>;

/**
 * The schema for the query arguments of the collector.
 */
export const CollectorQueryArgsSchema = object({
  patientId: string(),
  userId: nullable(string()),
});

/**
 * Parse the query arguments of the collector.
 * @param args
 * @returns
 */
export const parseCollectorQueryArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(CollectorQueryArgsSchema, jsonData);
};
