# Hackathon 2024

Projet de Hackathon 2024 pour l'ESGI avec Calmedica sur le thème de la santé.

## Contenu

- [Hackathon 2024](#hackathon-2024)
  - [Contenu](#contenu)
  - [Lancement du projet](#lancement-du-projet)
  - [Liste des commandes disponibles](#liste-des-commandes-disponibles)
  - [Liste des utilisateurs](#liste-des-utilisateurs)
  - [Stack technique](#stack-technique)
  - [Liste des fonctionnalités](#liste-des-fonctionnalités)
    - [Qui a fait quoi ?](#qui-a-fait-quoi-)
    - [Comment sont gérés les messages ?](#comment-sont-gérés-les-messages-)
    - [Comment fonctionne "Le Doc" ?](#comment-fonctionne-le-doc-)
    - [Pour aller plus loin](#pour-aller-plus-loin)
  - [Drizzle studio](#drizzle-studio)

## Lancement du projet

> [!NOTE]  
> Une clé d'API OpenAI est nécessaire pour lancer le projet. Vous pouvez en créer une [sur le site OpenAI](https://platform.openai.com/api-keys).

Pour lancer le projet, suivre les étapes suivantes :

1. Cloner le projet
2. Créer un fichier `.env.local` et ajouter sa clé d'API OpenAI `OPENAI_API_KEY=MY_API_KEY`
3. Lancer la commande `make start`
4. Ouvrir un navigateur et aller à l'adresse [http://localhost:5173](http://localhost:5173)

PHPMyAdmin est disponible à l'adresse [http://localhost:5174](http://localhost:5174) avec les identifiants `root` et `root` (serveur `mysql`).

C'est tout !

## Liste des commandes disponibles

Vous pouvez lancer la commande `make help` pour voir la liste des commandes disponibles.

## Liste des utilisateurs

> [!NOTE]
> Ces emails sont fictifs et ne sont pas réels.

Les utilisateurs suivants sont ajoutés par les fixtures :

- `michaelscott@calmedica.com`
- `johndoe@calmedica.com`
- `janedoe@calmedica.com`
- `bobrazowski@calmedica.com`

Tous les utilisateurs ont le mot de passe `xxx`.

## Stack technique

La stack technique utilisée est la suivante :

- [SvelteKit](https://kit.svelte.dev)
- [Svelte 5](https://svelte-5-preview.vercel.app/docs/introduction)
- [Docker](https://www.docker.com)
- [Mercure](https://mercure.rocks)
- [MySQL](https://www.mysql.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [OpenAI](https://github.com/openai/openai-node)
- [Superforms](https://superforms.rocks) + [Valibot](https://valibot.dev)
- [shadcn-svelte](https://www.shadcn-svelte.com/)
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io)

## Liste des fonctionnalités

Les fonctionnalités suivantes sont disponibles :

- Page de garde
- Login (email + mot de passe)
- Page avec liste des patients
- Assistant "Le Doc" pour poser des questions, chercher des patients, etc.
- Page d'un patient avec historique des SMS
- Génération d'une fiche patient avec IA et téléchargement de la fiche en PNG
- Page factice d'envoi de SMS (pour un patient) disponible sur l'URL [http://localhost:5173/send-sms](http://localhost:5173/send-sms)
- Streaming : les réponses de l'assistant "Le Doc" et la génération de la fiche patient sont en streaming, et apparaissent en temps réel dans l'application
- Temps réel : le reçu des messages se fait en temps réel dans l'application, avec notification toast lors de la réception d'un message
- Dark mode
- Accessibilité : l'application est accessible aux personnes malvoyantes et autres (tabulation, raccourcis clavier, etc.)
- Responsive design : l'application est responsive et s'adapte à toutes les tailles d'écran
- Simple : le design est simple et épuré, pour une meilleure expérience utilisateur

### Qui a fait quoi ?

Voir les personnes assignées aux [différentes issues](https://github.com/YummYume/didactic-umbrella/issues?q=is%3Aissue+assignee%3A*+).

### Comment sont gérés les messages ?

Chaque message est analysé par l'IA pour déterminer s'il s'agit d'une réponse à un message précédent, ou simplement un nouveau message.

L'IA s'occupe aussi de déterminer différents facteurs sur chaque message, comme la gravité du besoin, la demande du patient, etc.
Ces données sont ensuite stockées et utilisées par "Le Doc" pour répondre et rechercher des informations de manière plus précise.
Ces données sont également utilisées pour générer la fiche patient.

### Comment fonctionne "Le Doc" ?

"Le Doc" est un assistant qui utilise l'API OpenAI (actuellement sur le modèle `gpt-4-turbo`).

Sa vraie force est de pouvoir exécuter des actions à la demande de l'utilisateur. Il est actuellement capable de :

- Chercher un ou des patients
- Chercher un ou des messages
- Envoyer un SMS à un patient
- Générer une URL vers une fiche patient

OpenAI possède une nouvelle fonctionnalité qui permet à l'IA
[d'appeler des fonctions directement dans notre code](https://github.com/openai/openai-node?tab=readme-ov-file#automated-function-calls).
C'est dangereux, mais c'est aussi très puissant. Nous avons fait en sorte de sécuriser au maximum cette fonctionnalité
pour utiliser son plein potentiel en toute sécurité.

En combinant cette fonctionnalité avec le streaming, nous avons pu créer une expérience utilisateur unique et innovante.
Exemple de dialogue avec "Le Doc" :

```text
Moi: "Cherche un patient qui pourrait s'appeler John Doe"
**Début de la réponse de l'IA**
Le Doc: "Je cherche un patient qui pourrait s'appeler John Doe..."
**Appel de la fonction de recherche de patient**
**Préparation de la réponse**
**Appel de la fonction de génération d'URL**
Le Doc: "Voici le lien vers la fiche patient de John Doe : [fiche patient](**lien**)"
```

Le Doc est aussi capable de répondre en Markdown, ce qui permet de mettre en forme les réponses de l'IA.

La génération de la fiche patient n'est pas reliée directement à l'assistant, mais utilise le même principe de streaming
et le même modèle d'IA (`gpt-4-turbo`). La fiche est entièrement en Markdown puis téléchargeable en PNG.

### Pour aller plus loin

Il serait possible d'aller encore plus loin sur beaucoup de points, pour pousser encore plus loin l'expérience utilisateur :

- Permettre à l'utilisateur d'upload un fichier vocal ou une image pour l'assistant
- Permettre à l'utilisateur de dire à l'IA quoi afficher lors de la génération de la fiche patient
- Permettre à l'IA d'analyser des messages vocaux et MMS
- Ajouter des "threads" pour sauvegarder les conversations avec l'assistant, et en avoir plusieurs en même temps
- Inventer des systèmes de gestion plus avancés où l'IA serait capable d'effectuer la plupart des tâches de l'application

## Drizzle studio

Si vous ne voulez pas utiliser PHPMyAdmin, vous pouvez utiliser Drizzle Studio pour gérer la base de données. C'est un outil de gestion de base de données basé sur le web qui vous permet de gérer votre base de données à l'aide d'une interface web.

Vous avez juste besoin d'aller sur [https://local.drizzle.studio](https://local.drizzle.studio) pour y accéder.
