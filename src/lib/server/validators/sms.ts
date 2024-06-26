import { length, minLength, object, pipe, string } from 'valibot';

export const validateSMS = object({
  phone: pipe(string(), length(10, 'Veuillez saisir un numéro de téléphone valide.')),
  message: pipe(string(), minLength(1, 'Veuillez saisir un message.')),
});
