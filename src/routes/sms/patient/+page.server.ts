import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
  send: async ({ request, fetch }) => {
    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    if (!phone || !message) {
      return fail(400, {
        error: 'Veuillez saisir un numéro de téléphone et un message.',
      });
    }

    try {
      const response = await fetch('/api/sms/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, message }),
      });

      if (!response.ok) {
        const data = await response.json();

        return fail(response.status, {
          previous: {
            phone,
            message,
          },
          error: data.message,
        });
      }

      return { success: response.statusText };
    } catch (err) {
      console.error('Error sending SMS:');
      console.error(err);

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
