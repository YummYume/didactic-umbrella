/**
 * Error thrown by the `Assistant` component.
 */
export class AssistantError extends Error {
  private static readonly NAME = 'AssistantError';

  /**
   * Whether to pop the last message from the assistant when this error is thrown.
   */
  popLastMessage: boolean;

  constructor(message: string, popLastMessage = false) {
    super(message);

    this.name = AssistantError.NAME;
    this.popLastMessage = popLastMessage;
  }
}
