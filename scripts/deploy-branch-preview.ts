import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { previewContext } from "./branch-stage";

type DeployState = {
  branch: string;
  stage: string;
  lastDeployedCommit?: string;
  lastDeployStartedAt?: string;
  lastDeployFinishedAt?: string;
  status?: "success" | "failed";
  logPath?: string;
};

const statePath = join(process.cwd(), ".git", "preview-deploy-state.json");
const logPath = join(process.cwd(), ".git", "preview-deploy.log");

function readState(): DeployState | undefined {
  if (!existsSync(statePath)) return undefined;
  return JSON.parse(readFileSync(statePath, "utf8")) as DeployState;
}

function writeState(state: DeployState) {
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  writeFileSync(logPath, output);
  process.stdout.write(output);

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

if (process.env.SKIP_PREVIEW_DEPLOY === "1") {
  console.log("Skipping branch preview deploy because SKIP_PREVIEW_DEPLOY=1.");
  process.exit(0);
}

const context = previewContext();
const previous = readState();

if (previous?.stage === context.stage && previous.lastDeployedCommit === context.commit && previous.status === "success") {
  console.log(`Preview for ${context.branch} already deployed at ${context.commit.slice(0, 7)}.`);
  process.exit(0);
}

console.log(`Deploying branch preview: branch=${context.branch} stage=${context.stage} commit=${context.commit.slice(0, 7)}`);

writeState({
  ...context,
  lastDeployStartedAt: new Date().toISOString(),
  status: "failed",
  logPath,
});

try {
  run("bun", ["run", "build"]);
  run("bun", ["run", "deploy", "--", "--stage", context.stage], {
    ALCHEMY_STAGE: context.stage,
  });

  writeState({
    ...context,
    lastDeployedCommit: context.commit,
    lastDeployStartedAt: previous?.lastDeployStartedAt,
    lastDeployFinishedAt: new Date().toISOString(),
    status: "success",
    logPath,
  });

  console.log(`Branch preview deployed for ${context.branch} at stage ${context.stage}.`);
} catch (error) {
  writeState({
    ...context,
    lastDeployStartedAt: previous?.lastDeployStartedAt,
    lastDeployFinishedAt: new Date().toISOString(),
    status: "failed",
    logPath,
  });
  console.error(error instanceof Error ? error.message : error);
  console.error(`Preview deploy failed. See ${logPath}`);
  process.exit(1);
}
