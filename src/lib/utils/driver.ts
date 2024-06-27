import { driver } from 'driver.js';

import { Actions } from '$lib/enums/actions';
import { Status } from '$lib/enums/status';

export const driverjs = driver({
  doneBtnText: 'Terminé',
  nextBtnText: 'Suivant',
  popoverClass: 'driverjs-theme',
  prevBtnText: 'Précédent',
  showProgress: true,
  steps: [
    {
      element: `[aria-label="${Actions.Enrole}"]`,
      popover: {
        title: Actions.Enrole,
        description: 'Enrôlez un patient en cliquant sur ce bouton.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[aria-label="${Actions.Import}"]`,
      popover: {
        title: Actions.Import,
        description: 'Importez un ou plusieurs fichiers en cliquant sur ce bouton.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[aria-label="${Actions.Download}"]`,
      popover: {
        title: Actions.Download,
        description: 'Téléchargez le contenu du tableau en cliquant sur ce bouton.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: ':has(>[type="search"])',
      popover: {
        title: 'Recherche',
        description: "Entrez n'importe quel mot(s) clé(s) pour filtrer les résultats du tableau.",
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '[data-toggle-group-root]',
      popover: {
        title: 'Indicateurs de statut',
        description:
          'Par défaut, tous les statuts sont affichés. Cliquez sur une icône pour filtrer les résultats par statut.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${Status.Ok}"]`,
      popover: {
        title: 'Coche grise',
        description: 'La demande du patient a bien été traitée.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${Status.Pending}"]`,
      popover: {
        title: 'Bulle jaune',
        description:
          "Le patient a répondu à une question qu'on lui a posé manuellement, ou il a envoyé un document.",
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${Status.Unexpected}"]`,
      popover: {
        title: 'Cloche orange',
        description: "Le patient ne va pas bien, ou sa réponse n'a pas étée comprise.",
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${Status.Unreachable}"]`,
      popover: {
        title: 'Téléphone bleu',
        description:
          'Le suivi est impossible par SMS car le numéro de téléphone du patient est invalide, ou alors un problème technique interne est survenu.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#tabs',
      popover: {
        title: 'Onglets',
        description:
          'Utilisez les onglets pour afficher uniquement les résultats à une étape spécifique (ou toutes).',
        side: 'left',
        align: 'start',
      },
    },
  ],
});
