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

  const patientsDisplay = allPatients.map((patient) => {
    return {
      id: patient.id,
      phone: patient.phone,
      messagesCount: patient.messages.length,
    };
  });

  return {
    seo: {
      title: 'Patients',
      meta: {
        description: 'Liste des patients.',
      },
    },
    allPatients,
    assistantContext: `L'utilisateur se trouve actuellement sur la page d'administration dédiée aux patients. Cette page contient une liste des patients enregistrés dans la base de données. Les patients actuellement visibles (numéro de téléphone + ID + nombre de messages) sont : ${JSON.stringify(patientsDisplay)}. Ceci n'est qu'une petite partie des patients enregistrés et des données disponibles.`,
  };
}) satisfies PageServerLoad;
