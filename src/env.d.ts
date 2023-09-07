/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/auth").Auth;
  type DatabaseUserAttributes = {
    id: string;
    name: string | null;
  };
  type DatabaseSessionAttributes = {};
}

/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}

interface ImportMetaEnv {
  readonly GITHUB_CLIENT_ID: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly DATABASE_URL: string;
  readonly DATABASE_AUTH_TOKEN?: string;
  readonly VITE_PUBLIC_TINYBIRD_TOKEN?: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
