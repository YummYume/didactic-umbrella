import { error } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import { MessageSchema } from '$lib/schemas/sms';

import type { Message } from '$components/chat/Chat.svelte';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params, depends }) => {
  const { db } = locals;
  const { id } = params;

  const patient = await db.query.patients.findFirst({
    where: (patients, { eq }) => eq(patients.id, id),
    with: {
      messages: {
        orderBy: (messages, { asc }) => asc(messages.updatedAt),
        with: {
          responses: {
            orderBy: (responses, { asc }) => asc(responses.updatedAt),
          },
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

  const messages = patient.messages.reduce<Message[]>((acc, message) => {
    acc.push({
      id: message.id,
      content: message.content,
      sender: message.userId ? 'self' : 'other',
    });

    message.responses.forEach((response) => {
      acc.push({
        id: response.id,
        content: response.content,
        sender: response.userId ? 'self' : 'other',
      });
    });
    return acc;
  }, []);

  return {
    seo: {
      title: `Patient ${patient.phone}`,
      meta: {
        description: `Fiche du patient avec le numéro de téléphone ${patient.phone}.`,
      },
    },
    form: await superValidate(valibot(MessageSchema)),
    messages,
    patient,
    assistantContext: `L'utilisateur se trouve actuellement sur la page d'administration dédiée à un patient spécifique. La page contient le numéro de téléphone du patient, ainsi que des messages et des réponses associés. L'utilisateur peut également cliquer sur un bouton en haut à droite pour générer un résumé de la fiche du patient. Il peut ensuite la télécharger au format PNG. Cela n'est possible que si le patient a des messages enregistrés dans la base de données. Le patient actuellement visible est : ${JSON.stringify(patientDisplay)}. Ceci n'est qu'une petite partie des données disponibles.`,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  send: async (event) => {
    const { params, locals, fetch } = event;
    const { session, db } = locals;

    if (!session) {
      return fail(401, {
        form: {
          valid: false,
          errors: {
            _errors: ['Vous devez être connecté pour envoyer un message.'],
          },
        },
      });
    }

    if (!params.id) {
      return fail(400, {
        form: {
          valid: false,
          errors: {
            _errors: ["L'identifiant du patient est requis."],
          },
        },
      });
    }

    const patient = await db.query.patients.findFirst({
      where: (patients, { eq }) => eq(patients.id, params.id),
    });

    if (!patient) {
      return fail(404, {
        form: {
          valid: false,
          errors: {
            _errors: ['Ce patient est introuvable.'],
          },
        },
      });
    }

    const form = await superValidate(event, valibot(MessageSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    try {
      const response = await fetch('/api/sms/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: params.id,
          message: form.data.message,
        }),
      });

      if (!response.ok && response.status >= 400) {
        // @ts-expect-error - We know that the response is not ok
        return message(form, (await response.json()).message, { status: `${response.status}` });
      }

      return message(form, 'Message envoyé avec succès.');
    } catch (error) {
      console.error('Error when sending a message : ', error);
      return fail(500, {
        form,
        error: 'Une erreur s’est produite lors de l’envoi du message. Veuillez réessayer.',
      });
    }
  },
};
