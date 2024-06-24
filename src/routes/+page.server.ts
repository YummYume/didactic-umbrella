import type { PageServerLoad } from './$types';

export const load = (async () => {
  return {
    title: 'Hackathon 2024',
  };
}) satisfies PageServerLoad;
