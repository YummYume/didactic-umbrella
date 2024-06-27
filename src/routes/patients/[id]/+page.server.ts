import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { patients } from '$server/db/schema/patients';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
  const { db } = locals;
  const { id } = params;

  const patient = await db.query.patients.findFirst({
    where: eq(patients.id, id),
    with: {
      responses: {
        with: {
          messages: true,
        },
      },
    },
  });

  if (!patient) {
    throw error(404, "Ce patient est introuvable. Veuillez vérifier l'URL ou revenir à l'accueil.");
  }

  return {
    seo: {
      title: `Patient ${patient.phone}`,
      meta: {
        description: `Fiche du patient avec le numéro de téléphone ${patient.phone}.`,
      },
    },
    patient,
  };
}) satisfies PageServerLoad;
