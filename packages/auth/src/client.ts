import { createAuthClient } from "better-auth/client";

export interface AuthClientOptions {
  baseURL?: string;
}

export function createFounderAuthClient(options: AuthClientOptions = {}) {
  return createAuthClient({
    baseURL: options.baseURL,
  });
}

export type AuthClient = ReturnType<typeof createFounderAuthClient>;
