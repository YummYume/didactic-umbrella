import {
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

export const TypeMessage = {
  responses: 'responses',
  messages: 'messages',
} as const;

export const CategoryMessage = {
  inaproppriate: 'inaproppriate',
  normal: 'normal',
  important: 'important',
} as const;

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

export const CollectorQueryArgsSchema = object({
  patientId: string(),
});

export const parseCollectorQueryArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(CollectorQueryArgsSchema, jsonData);
};
