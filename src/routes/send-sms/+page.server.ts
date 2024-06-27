import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
  send: async ({ request, fetch }) => {
    const formData = await request.formData();

    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, message }),
      });

      if (!response.ok) {
        return fail(response.status, {
          previous: {
            phone,
            message,
          },
          error: (await response.json()).message,
        });
      }

      return { success: 'SMS envoyé avec succès' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return fail(500, {
        previous: {
          phone,
          message,
        },
        error: "Erreur lors de l'envoi du SMS. Veuillez réessayer.",
      });
    }
  },
};
