import { redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

import { patients } from '$server/db/schema/patients';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  const { db, session } = locals;
  if (!session) {
    redirect(302, '/login');
  }

  const allPatients = await db.query.patients.findMany({
    orderBy: [desc(patients.createdAt)],
    with: {
      messages: {
        with: {
          responses: true,
        },
      },
    },
  });

  return {
    seo: {
      title: 'Patients',
      meta: {
        description: 'Liste des patients.',
      },
    },
    allPatients,
  };
}) satisfies PageServerLoad;
