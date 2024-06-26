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
        return fail(response.status, await response.json());
      }

      const data = await response.json();

      return { smsSent: data };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return fail(500, {
        previous: {
          phone,
          message,
        },
        message: 'Failed to send SMS.',
      });
    }
  },
};
