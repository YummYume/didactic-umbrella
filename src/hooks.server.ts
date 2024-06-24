import { mistralClient } from '$server/mistral';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.mistral = mistralClient;

  const response = await resolve(event);

  return response;
};
