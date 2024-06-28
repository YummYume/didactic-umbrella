import { loadFlash } from 'sveltekit-flash-message/server';

import type { LayoutServerLoad } from './$types';

export const load = loadFlash(async ({ locals }) => {
  const { user } = locals;

  return {
    seo: {
      title: 'Hackathon 2024',
    },
    user: user ?? undefined,
  };
}) satisfies LayoutServerLoad;
