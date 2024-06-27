import { type InferOutput, length, minLength, object, pipe, string } from 'valibot';

export const smsSchema = object({
  phone: pipe(string(), length(10, 'Veuillez saisir un numéro de téléphone valide.')),
  message: pipe(string(), minLength(1, 'Veuillez saisir un message.')),
});

export type SmsSchemaType = InferOutput<typeof smsSchema>;
