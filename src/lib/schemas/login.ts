import { email, type InferOutput, maxLength, nonEmpty, object, pipe, string } from 'valibot';

export const loginSchema = object({
  email: pipe(
    string(),
    nonEmpty('Veuillez saisir votre email.'),
    email('Veuillez saisir un email valide.'),
    maxLength(30, 'Votre email est trop long.'),
  ),
  password: pipe(string(), nonEmpty('Veuillez saisir votre mot de passe.')),
});

export type LoginSchemaType = InferOutput<typeof loginSchema>;
