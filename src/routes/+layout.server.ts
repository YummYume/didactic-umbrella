import { loadFlash } from 'sveltekit-flash-message/server';

import type { LayoutServerLoad } from './$types';

export const load = loadFlash(async () => {
  return {
    seo: {
      title: 'Hackathon 2024',
    },
  };
}) satisfies LayoutServerLoad;
