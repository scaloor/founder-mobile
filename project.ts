export const PROJECT_SLUG = "founder-mobile";
export const PROJECT_DISPLAY_NAME = "Founder Mobile";

export function projectResourceName(stage: string, suffix: string) {
  return `${PROJECT_SLUG}-${stage}-${suffix}`;
}
