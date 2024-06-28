import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { loginSchema } from '$lib/schemas/login';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = locals;
  if (session) {
    redirect(302, '/');
  }

  return {
    form: await superValidate(valibot(loginSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const { locals, cookies } = event;
    const { db, auth } = locals;

    const form = await superValidate(event, valibot(loginSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, form.data.email),
    });

    if (!existingUser) {
      return message(form, 'Adresse email ou mot de passe incorrect.');
    }

    const validPassword = await bcrypt.compare(form.data.password, existingUser.password);
    if (!validPassword) {
      return message(form, 'Adresse email ou mot de passe incorrect.');
    }

    const session = await auth.createSession(existingUser.id, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    redirect(302, '/');
  },
};
