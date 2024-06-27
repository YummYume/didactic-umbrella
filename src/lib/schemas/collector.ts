import {
  enum_,
  type InferOutput,
  integer,
  maxValue,
  minValue,
  nullish,
  number,
  object,
  parse,
  picklist,
  pipe,
  string,
} from 'valibot';

import { CategoryMessage, TypeMessage } from '$server/utils/collector';

export const TypeMessageSchema = enum_(TypeMessage);
export const CategoryMessageSchema = enum_(CategoryMessage);

/**
 * The schema for a message sent by the collector.
 */
export const collectorSchema = object({
  type: pipe(string(), picklist(Object.values(TypeMessage))),
  category: pipe(string(), picklist(Object.values(CategoryMessage))),
  levelImportance: pipe(number(), integer(), minValue(1), maxValue(5)),
  subject: string(),
  intent: string(),
  informations: object({
    symptom: string(),
    onset: string(),
    details: string(),
    complementInformations: string(),
  }),
  messageLinkId: nullish(string()),
});

export type CollectorSchemaType = InferOutput<typeof collectorSchema>;

/**
 * The schema for the query arguments of the collector.
 */
export const CollectorQueryArgsSchema = object({
  patientId: string(),
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
