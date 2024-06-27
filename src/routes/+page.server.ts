import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    title: 'La solution de dialogue automatisé',
  };
}) satisfies PageServerLoad;
