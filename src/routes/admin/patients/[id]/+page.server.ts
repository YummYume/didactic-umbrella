import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { patients } from '$server/db/schema/patients';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params, depends }) => {
  const { db } = locals;
  const { id } = params;

  const patient = await db.query.patients.findFirst({
    where: eq(patients.id, id),
    with: {
      messages: {
        with: {
          responses: true,
        },
      },
    },
  });

  if (!patient) {
    throw error(404, "Ce patient est introuvable. Veuillez vérifier l'URL ou revenir à l'accueil.");
  }

  depends(`app:patients:${id}`);

  const patientDisplay = {
    id: patient.id,
    phone: patient.phone,
    messagesCount: patient.messages.length,
  };

  return {
    seo: {
      title: `Patient ${patient.phone}`,
      meta: {
        description: `Fiche du patient avec le numéro de téléphone ${patient.phone}.`,
      },
    },
    patient,
    assistantContext: `L'utilisateur se trouve actuellement sur la page d'administration dédiée à un patient spécifique. La page contient le numéro de téléphone du patient, ainsi que des messages et des réponses associés. L'utilisateur peut également cliquer sur un bouton en haut à droite pour générer un résumé de la fiche du patient. Il peut ensuite la télécharger au format PNG. Cela n'est possible que si le patient a des messages enregistrés dans la base de données. Le patient actuellement visible est : ${JSON.stringify(patientDisplay)}. Ceci n'est qu'une petite partie des données disponibles.`,
  };
}) satisfies PageServerLoad;
