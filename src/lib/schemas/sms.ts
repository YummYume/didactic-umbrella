import { type InferOutput, length, minLength, object, pipe, string } from 'valibot';

export const MessageField = pipe(string(), minLength(1, 'Veuillez saisir un message.'));

export const MessageSchema = object({
  message: MessageField,
});

export type MessageSchemaType = InferOutput<typeof MessageSchema>;

export const SmsSchema = object({
  phone: pipe(string(), length(10, 'Veuillez saisir un numéro de téléphone valide.')),
  message: MessageField,
});

export type SmsSchemaType = InferOutput<typeof SmsSchema>;

export const SmsUserSchema = object({
  patientId: string("L'identifiant du patient est requis."),
  message: MessageField,
});

export type SmsUserSchemaType = InferOutput<typeof SmsUserSchema>;
