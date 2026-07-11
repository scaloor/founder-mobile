export const authBasePath = "/api/auth";
export const authAppName = "Founder Mobile";
export const fallbackDevelopmentSecret = "dev-only-better-auth-secret-change-before-production";

export function parseTrustedOrigins(value: string | undefined) {
  return value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
