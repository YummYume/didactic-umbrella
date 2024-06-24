import type MistralClient from '@mistralai/mistralai';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      mistral: MistralClient;
    }
    interface PageData {
      title?: string;
      flash?: { type: 'success' | 'error' | 'info' | 'warning'; message: string };
      seo?: {
        title?: string;
        meta?: {
          description?: string;
          [key: string]: string?;
        };
      };
    }
    // interface PageState {}
    // interface Platform {}
  }

  interface ViewTransition {
    updateCallbackDone: Promise<void>;
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition: () => void;
  }

  interface Document {
    startViewTransition(updateCallback: () => Promise<void>): ViewTransition;
  }
}

export {};
