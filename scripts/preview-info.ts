import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { previewContext } from "./branch-stage";

const context = previewContext({ allowProtected: true });
const statePath = join(process.cwd(), ".git", "preview-deploy-state.json");

console.log(`Branch: ${context.branch}`);
console.log(`Stage:  ${context.stage}`);
console.log(`Commit: ${context.commit.slice(0, 7)}`);

if (existsSync(statePath)) {
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  console.log(`Last deployed commit: ${state.lastDeployedCommit?.slice(0, 7) ?? "never"}`);
  console.log(`Status: ${state.status ?? "unknown"}`);
  console.log(`Log: ${state.logPath ?? ".git/preview-deploy.log"}`);
} else {
  console.log("No local preview deploy state recorded yet.");
}
