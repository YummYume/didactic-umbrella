import { lucia } from '$server/auth';
import { db } from '$server/db';
import { openai } from '$server/openai';

import type { Handle, HandleServerError } from '@sveltejs/kit';

const ERROR_MESSAGE: Record<'404' | '500' | string, string> = {
  404: "La page demandée n'existe pas.",
  500: 'Le serveur a rencontré un problème.',
};
const ASSISTANT_DEFAULT_ERROR_PROMPT = `
  Ton but est d'aider l'utilisateur à résoudre son problème.
  Indique à l'utilisateur qu'il peut retourner sur la page d'accueil en cliquant sur le bouton "Retour à l'accueil".
`;
const ASSISTANT_ERROR_PROMPT: Record<'404' | '500' | string, string> = {
  404: `
    Si l'utilisateur te sollicite, indique lui que la page demandée n'existe pas.
    Demande à l'utilisateur de vérifier l'URL ou de retourner sur la page d'accueil.
  `,
  500: `
    Si l'utilisateur te sollicite, indique lui que le serveur a rencontré un problème.
    Demande à l'utilisateur de réessayer plus tard ou de retourner sur la page d'accueil.
  `,
};

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.openai = openai;
  event.locals.db = db;
  event.locals.auth = lucia;

  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  const response = await resolve(event);

  return response;
};

export const handleError: HandleServerError = async ({ message, status, error }) => {
  if (status >= 500) {
    console.error(`Unhandled error "${message}" with status ${status}:`, error);
  }

  let prompt = `L'utilisateur se trouve actuellement sur une page d'erreur ${status}.`;

  if (ASSISTANT_ERROR_PROMPT[status.toString()]) {
    prompt += ASSISTANT_ERROR_PROMPT[status.toString()];
  }

  prompt += ASSISTANT_DEFAULT_ERROR_PROMPT;

  return {
    message: ERROR_MESSAGE[status.toString()] || message,
    carlosContext: { prompt },
  };
};
