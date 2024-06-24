import MistralClient from '@mistralai/mistralai';

import { MISTRAL_AI_API_KEY } from '$env/static/private';

export const mistralClient = new MistralClient(MISTRAL_AI_API_KEY);
