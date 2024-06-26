import { redirect } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';

import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  return {
    assistantContext: locals.user
      ? "L'utilisateur se trouve actuellement sur la page d'accueil et peut accéder à l'administration en cliquant sur le bouton approprié."
      : undefined,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  logout: async (event) => {
    const { auth, session } = event.locals;

    if (!session) {
      return fail(401);
    }

    await auth.invalidateSession(session.id);

    const sessionCookie = auth.createBlankSessionCookie();

    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/login');
  },
};
