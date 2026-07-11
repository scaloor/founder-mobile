import { betterAuth } from "better-auth";
import {
  authAppName,
  authBasePath,
  fallbackDevelopmentSecret,
  parseTrustedOrigins,
} from "./config";

export interface AuthEnvironment {
  DB: D1Database;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_TRUSTED_ORIGINS?: string;
  ENVIRONMENT?: string;
}

export interface CreateAuthOptions {
  /**
   * Override the default email/password starter setting.
   * Keep this basic; add OAuth, organization, username, or other plugins only
   * after checking the current Better Auth docs for the chosen product shape.
   */
  emailAndPasswordEnabled?: boolean;
}

export function createAuth(env: AuthEnvironment, options: CreateAuthOptions = {}) {
  return betterAuth({
    appName: authAppName,
    basePath: authBasePath,
    baseURL: env.BETTER_AUTH_URL,
    secret: getAuthSecret(env),
    database: env.DB,
    trustedOrigins: parseTrustedOrigins(env.BETTER_AUTH_TRUSTED_ORIGINS),
    emailAndPassword: {
      enabled: options.emailAndPasswordEnabled ?? true,
    },
    socialProviders: {},
    plugins: [],
  });
}

function getAuthSecret(env: AuthEnvironment) {
  if (env.BETTER_AUTH_SECRET) {
    return env.BETTER_AUTH_SECRET;
  }

  if (env.ENVIRONMENT === "production") {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }

  return fallbackDevelopmentSecret;
}

export type Auth = ReturnType<typeof createAuth>;
