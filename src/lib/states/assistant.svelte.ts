import { getContext, setContext } from 'svelte';

import type { AssistantStatus } from '$components/Assistant.svelte';
import type { Message } from '$components/chat/Chat.svelte';

export class AssistantState {
  status: AssistantStatus = $state('available');

  answer: string = $state('');

  messages: Message[] = $state([]);

  abortController: AbortController = $state(new AbortController());

  constructor() {
    $effect(() => {
      return () => {
        this.abortController.abort();
      };
    });
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  updateLastMessageContent(content: string, replace = true) {
    const lastMessage = this.lastMessage;

    if (lastMessage) {
      if (replace) {
        lastMessage.content = content;
      } else {
        lastMessage.content += content;
      }
    }
  }

  get lastMessage() {
    return this.messages.at(-1);
  }
}

export const ASSISTANT_CONTEXT_KEY = Symbol('assistant');

export const initAssistantState = () => {
  return setContext(ASSISTANT_CONTEXT_KEY, new AssistantState());
};

export const getAssistantState = () => {
  return getContext<ReturnType<typeof initAssistantState>>(ASSISTANT_CONTEXT_KEY);
};
