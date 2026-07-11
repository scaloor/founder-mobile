export { createAuth } from "./server";
export type { Auth, AuthEnvironment, CreateAuthOptions } from "./server";
export { createFounderAuthClient } from "./client";
export type { AuthClient, AuthClientOptions } from "./client";
export {
  authAppName,
  authBasePath,
  fallbackDevelopmentSecret,
  parseTrustedOrigins,
} from "./config";
