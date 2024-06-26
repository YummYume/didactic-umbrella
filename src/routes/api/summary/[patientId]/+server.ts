import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { patients } from '$server/db/schema/patients';
import { CollectorSchema } from '$server/schemas/collector';

import type { RequestHandler } from './$types';

const GENERATOR_ROLE_CONTENT = `
  Tu es un générateur de fiches médicales pour les patients. Tu dois générer un résumé pour le patient donné, en utilisant les messages qu'il a envoyés.

  Tu dois générer ce résumé en Markdown, de manière à ce qu'il soit lisible et compréhensible par le personnel médical. Tu dois inclure toutes les informations pertinentes, mais tu ne dois pas donner de conseils médicaux. De manière générale, essaie de mettre le plus d'informations possibles pour obtenir une fiche complète et compréhensible, avec du texte à lire.

  Les messages du patient sont ceux qui ne sont pas reliés à un utilisateur. Tu dois éviter au maximum de montrer le contenu des messages dans la fiche, car ces derniers sont déjà disponibles sur la page du patient. Tu dois cependant utiliser au maximum les informations contenues dans la propriété "data" des messages pour générer le résumé.

  Tu peux ajouter une note à la fin de la fiche pour que le personnel médical sache si le résumé a été généré avec assez d'informations, ou s'il manque des messages pour faire un résumé complet. Si c'est le cas, commence cette note par "**Attention:** Ce résumé a été généré sur la base d'un nombre limité de messages..." puis continue avec les informations nécessaires.

  Voici un schéma que tu peux suivre et ajuster au besoin : Titre (Fiche Médicale du Patient), Informations Générales, Consultations Récentes, Dernier Échange, État de Santé Actuel, Notes, etc. Tu peux ajouter ou retirer des sections selon les informations que tu as.
`;

export const GET: RequestHandler = async ({ locals, params }) => {
  const { db } = locals;
  const { patientId } = params;

  const patient = await db.query.patients.findFirst({
    where: eq(patients.id, patientId),
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

  // @ts-expect-error - Likely a bug in the type definition from the library
  const collectedDataSchema = toJSONSchema({ schema: CollectorSchema });

  const stream = await locals.openai.chat.completions.create({
    model: 'gpt-4-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: GENERATOR_ROLE_CONTENT,
      },
      {
        role: 'system',
        content: `Pour référence, voici le schéma utilisé lors de la collecte des données d'un message : ${collectedDataSchema}. La propriété "levelImportance" va de 1 à 5, où 1 est le plus bas et 5 est le plus haut.`,
      },
      {
        role: 'user',
        content: `Données du patient "${patientId}" à utiliser pour générer le résumé : "${JSON.stringify(patient)}".`,
      },
    ],
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
