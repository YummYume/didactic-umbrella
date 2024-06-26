import {
  type InferOutput,
  nullable,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
} from 'valibot';

export const IntentSchema = object({
  search: nullable(pipe(string(), picklist(['clients', 'client']))),
  property: optional(pipe(string(), picklist(['phone', 'name', 'undetermined']))),
  query: optional(string()),
  startDate: optional(
    pipe(
      string(),
      transform((input) => new Date(input)),
    ),
  ),
  endDate: optional(
    pipe(
      string(),
      transform((input) => new Date(input)),
    ),
  ),
});

export type IntentSchemaType = InferOutput<typeof IntentSchema>;
