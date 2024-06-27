/**
 * The minimum length of a message.
 */
export const MESSAGE_MIN_LENGTH = 1;

/**
 * The maximum length of a message.
 */
export const MESSAGE_MAX_LENGTH = 4000;

/**
 * Available message roles when communicating with the assistant.
 */
export enum MessageRole {
  Assistant = 'assistant',
  User = 'user',
}
