import { spawnSync } from "node:child_process";
import { previewContext } from "./branch-stage";

const { branch, stage } = previewContext();

if (process.env.CONFIRM_DESTROY_PREVIEW !== "1") {
  console.error(
    `Refusing to destroy preview for branch '${branch}' / stage '${stage}' without CONFIRM_DESTROY_PREVIEW=1.`,
  );
  console.error(`Run: CONFIRM_DESTROY_PREVIEW=1 bun run preview:destroy`);
  process.exit(1);
}

console.log(`Destroying branch preview: branch=${branch} stage=${stage}`);
const result = spawnSync("bun", ["run", "destroy", "--", "--stage", stage, "--yes"], {
  cwd: process.cwd(),
  env: { ...process.env, ALCHEMY_STAGE: stage },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
