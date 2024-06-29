/**
 * Error thrown by the `Assistant` component.
 */
export class AssistantError extends Error {
  private static readonly NAME = 'AssistantError';

  constructor(message: string) {
    super(message);

    this.name = AssistantError.NAME;
  }
}
