import {
  array,
  enum_,
  type InferOutput,
  minValue,
  number,
  object,
  optional,
  parse,
  pipe,
  string,
} from 'valibot';

import {
  AssistantAllowedCriteria,
  AssistantAllowedFrom,
  AssistantAllowedMessageProperty,
  AssistantAllowedOrderByDirection,
  AssistantAllowedPatientProperty,
  AssistantAllowedPerPage,
  AssistantAllowedResponseProperty,
} from '$server/utils/assistant';

// DB for Assistant
/**
 * Allowed properties for the assistant on the `patients` table.
 */
export const AssistantFromSchema = enum_(AssistantAllowedFrom);

/**
 * Validate if the given value is a valid property for the assistant on the `patients` table.
 */
export const AssistantPatientPropertySchema = enum_(AssistantAllowedPatientProperty);

/**
 * Validate if the given value is a valid property for the assistant on the `messages` table.
 */
export const AssistantMessagePropertySchema = enum_(AssistantAllowedMessageProperty);

/**
 * Validate if the given value is a valid property for the assistant on the `responses` table.
 */
export const AssistantResponsePropertySchema = enum_(AssistantAllowedResponseProperty);

/**
 * Validate if the given value is a valid criteria for the assistant.
 */
export const AssistantCriteriaSchema = enum_(AssistantAllowedCriteria);

/**
 * Validate if the given value is a valid order by direction for the assistant.
 */
export const AssistantOrderByDirectionSchema = enum_(AssistantAllowedOrderByDirection);

/**
 * Validate if the given value is a valid page for the assistant.
 */
export const AssistantPageSchema = optional(pipe(number(), minValue(1)), 1);

/**
 * Validate if the given value is a valid per page for the assistant.
 */
export const AssistantPerPageSchema = optional(
  enum_(AssistantAllowedPerPage),
  AssistantAllowedPerPage.Ten,
);

/**
 * Validate all the arguments given by the assistant to query records.
 */
export const AssistantQueryRecordsArgsSchema = object({
  from: AssistantFromSchema,
  search: optional(
    object({
      patients: optional(
        array(
          object({
            field: AssistantPatientPropertySchema,
            criteria: AssistantCriteriaSchema,
            query: string(),
          }),
        ),
      ),
      messages: optional(
        array(
          object({
            field: AssistantMessagePropertySchema,
            criteria: AssistantCriteriaSchema,
            query: string(),
          }),
        ),
      ),
      responses: optional(
        array(
          object({
            field: AssistantResponsePropertySchema,
            criteria: AssistantCriteriaSchema,
            query: string(),
          }),
        ),
      ),
    }),
  ),
  orderBy: optional(
    object({
      patients: optional(
        array(
          object({
            field: AssistantPatientPropertySchema,
            direction: AssistantOrderByDirectionSchema,
          }),
        ),
      ),
      messages: optional(
        array(
          object({
            field: AssistantMessagePropertySchema,
            direction: AssistantOrderByDirectionSchema,
          }),
        ),
      ),
      responses: optional(
        array(
          object({
            field: AssistantResponsePropertySchema,
            direction: AssistantOrderByDirectionSchema,
          }),
        ),
      ),
    }),
  ),
  page: AssistantPageSchema,
  perPage: AssistantPerPageSchema,
});

/**
 * The parsing function for the assistant's query records arguments.
 */
export const parseAssistantQueryRecordsArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(AssistantQueryRecordsArgsSchema, jsonData);
};

export type AssistantQueryRecordsArgsSchemaType = InferOutput<
  typeof AssistantQueryRecordsArgsSchema
>;

/**
 * Validate the arguments given by the assistant to generate an URL to a patient's profile.
 */
export const AssistantGeneratePatientUrlArgsSchema = object({
  patientIds: array(string()),
});

/**
 * The parsing function for the assistant's generate patient URL arguments.
 */
export const parseAssistantGeneratePatientUrlArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(AssistantGeneratePatientUrlArgsSchema, jsonData);
};

export type AssistantGeneratePatientUrlArgsSchemaType = InferOutput<
  typeof AssistantGeneratePatientUrlArgsSchema
>;

/**
 * Validate the arguments given by the assistant to send an SMS.
 */
export const AssistantSendSmsArgsSchema = object({
  patientId: string(),
  message: string(),
});

/**
 * The parsing function for the assistant's send SMS arguments.
 */
export const parseAssistantSendSmsArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(AssistantSendSmsArgsSchema, jsonData);
};

export type AssistantSendSmsArgsSchemaType = InferOutput<typeof AssistantSendSmsArgsSchema>;
