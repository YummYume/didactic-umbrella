import { driver } from 'driver.js';

import { ACTION_DOWNLOAD, ACTION_ENROLE, ACTION_IMPORT } from '$lib/Enum/actions';
import { STATUS_OK, STATUS_PENDING, STATUS_UNEXPECTED, STATUS_UNREACHABLE } from '$lib/Enum/status';

export const driverObj = driver({
  doneBtnText: 'Terminé',
  nextBtnText: 'Suivant',
  popoverClass: 'driverjs-theme',
  prevBtnText: 'Précédent',
  showProgress: true,
  steps: [
    {
      element: `[aria-label="${ACTION_ENROLE}"]`,
      popover: {
        title: ACTION_ENROLE,
        description: 'Enrôlez un patient en cliquant sur ce bouton.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[aria-label="${ACTION_IMPORT}"]`,
      popover: {
        title: ACTION_IMPORT,
        description: 'Importez un ou plusieurs fichiers en cliquant sur ce bouton.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[aria-label="${ACTION_DOWNLOAD}"]`,
      popover: {
        title: ACTION_DOWNLOAD,
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
      element: `[data-toggle-group-root] [data-value="${STATUS_OK}"]`,
      popover: {
        title: 'Coche grise',
        description: 'La demande du patient a bien été traitée.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${STATUS_PENDING}"]`,
      popover: {
        title: 'Bulle jaune',
        description:
          "Le patient a répondu à une question qu'on lui a posé manuellement, ou il a envoyé un document.",
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${STATUS_UNEXPECTED}"]`,
      popover: {
        title: 'Cloche orange',
        description: "Le patient ne va pas bien, ou sa réponse n'a pas étée comprise.",
        side: 'left',
        align: 'start',
      },
    },
    {
      element: `[data-toggle-group-root] [data-value="${STATUS_UNREACHABLE}"]`,
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
