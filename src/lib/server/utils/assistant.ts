import { asc, desc, eq, gt, gte, like, lt, lte, ne, notIlike, type SQL } from 'drizzle-orm';

import { messages } from '$server/db/schema/messages';
import { patients } from '$server/db/schema/patients';
import { responses } from '$server/db/schema/responses';

import type { AssistantQueryRecordsArgsSchemaType } from '$server/schemas/assistant';

export enum AssistantAllowedFrom {
  Patients = 'patients',
  Messages = 'messages',
  Responses = 'responses',
}

/**
 * Allowed properties for the assistant on the `patients` table.
 */
export enum AssistantAllowedPatientProperty {
  Phone = 'phone',
}

/**
 * Allowed properties for the assistant on the `messages` table.
 */
export enum AssistantAllowedMessageProperty {
  Content = 'content',
  Data = 'data',
  PatientId = 'patientId',
  UserId = 'userId',
}

/**
 * Allowed properties for the assistant on the `responses` table.
 */
export enum AssistantAllowedResponseProperty {
  Content = 'content',
  Data = 'data',
  MessageId = 'messageId',
  UserId = 'userId',
}

/**
 * Allowed order by for the assistant.
 */
export enum AssistantAllowedOrderByDirection {
  Asc = 'asc',
  Desc = 'desc',
}

/**
 * Allowed criterias for the assistant.
 */
export enum AssistantAllowedCriteria {
  Equal = 'eq',
  NotEqual = 'ne',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  Like = 'like',
  NotIlike = 'not_ilike',
}

/**
 * Allowed per page for the assistant.
 */
export enum AssistantAllowedPerPage {
  One = 1,
  Five = 5,
  Ten = 10,
  TwentyFive = 25,
  Fifty = 50,
  Hundred = 100,
}

/**
 * Mapping of criteria to Drizzle functions.
 */
export const CriteriaSymbolMapping = {
  [AssistantAllowedCriteria.GreaterThan]: gt,
  [AssistantAllowedCriteria.LessThan]: lt,
  [AssistantAllowedCriteria.GreaterThanOrEqual]: gte,
  [AssistantAllowedCriteria.LessThanOrEqual]: lte,
  [AssistantAllowedCriteria.Equal]: eq,
  [AssistantAllowedCriteria.NotEqual]: ne,
  [AssistantAllowedCriteria.Like]: like,
  [AssistantAllowedCriteria.NotIlike]: notIlike,
};

/**
 * Get the criteria symbol for a given criteria.
 */
export const getCriteriaForEnum = (criteria: AssistantAllowedCriteria) =>
  CriteriaSymbolMapping[criteria];

/**
 * Build the search query for the assistant, returning an array of SQL WHERE clauses.
 */
export const buildSearch = (search: AssistantQueryRecordsArgsSchemaType['search']) => {
  const orX: SQL[] = [];

  if (!search) {
    return orX;
  }

  if (search.patients) {
    search.patients.forEach((search) => {
      const criteria = getCriteriaForEnum(search.criteria);

      orX.push(criteria(patients[search.field], search.query));
    });
  }

  if (search.messages) {
    search.messages.forEach((search) => {
      const criteria = getCriteriaForEnum(search.criteria);

      orX.push(criteria(messages[search.field], search.query));
    });
  }

  if (search.responses) {
    search.responses.forEach((search) => {
      const criteria = getCriteriaForEnum(search.criteria);

      orX.push(criteria(responses[search.field], search.query));
    });
  }

  return orX;
};

/**
 * Build the order by query for the assistant, returning an array of SQL ORDER BY clauses.
 */
export const buildOrderBy = (orderByDirectives: AssistantQueryRecordsArgsSchemaType['orderBy']) => {
  const orders: SQL[] = [];

  if (!orderByDirectives) {
    return orders;
  }

  if (orderByDirectives.patients) {
    orderByDirectives.patients.forEach((orderBy) => {
      orders.push(
        orderBy.direction === AssistantAllowedOrderByDirection.Asc
          ? asc(patients[orderBy.field])
          : desc(patients[orderBy.field]),
      );
    });
  }

  if (orderByDirectives.messages) {
    orderByDirectives.messages.forEach((orderBy) => {
      orders.push(
        orderBy.direction === AssistantAllowedOrderByDirection.Asc
          ? asc(messages[orderBy.field])
          : desc(messages[orderBy.field]),
      );
    });
  }

  if (orderByDirectives.responses) {
    orderByDirectives.responses.forEach((orderBy) => {
      orders.push(
        orderBy.direction === AssistantAllowedOrderByDirection.Asc
          ? asc(responses[orderBy.field])
          : desc(responses[orderBy.field]),
      );
    });
  }

  return orders;
};
