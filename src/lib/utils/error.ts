/**
 * Error thrown by the `Assistant` component.
 */
export class AssistantError extends Error {
  private static readonly NAME = 'AssistantError';

  /**
   * Whether to replace the last message from the assistant with an error message when this error is thrown.
   */
  replaceLastMessage: boolean;

  constructor(message: string, replaceLastMessage = false) {
    super(message);

    this.name = AssistantError.NAME;
    this.replaceLastMessage = replaceLastMessage;
  }
}
