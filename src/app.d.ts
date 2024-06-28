import type { Session, User } from 'lucia';
import type OpenAI from 'openai';
import type { lucia } from '$server/auth';
import type { db } from '$server/db';

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      errors?: SchemaIssues;
    }
    interface Locals {
      user: User | null;
      session: Session | null;
      db: typeof db;
      auth: typeof lucia;
      openai: OpenAI;
    }
    interface PageData {
      user?: User;
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
