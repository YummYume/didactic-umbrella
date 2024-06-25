import type MistralClient from '@mistralai/mistralai';
import type { Session, User } from 'lucia';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      mistral: MistralClient;
      user: User | null;
      session: Session | null;
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

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  firstName: string;
  lastName: string;
}

export {};
