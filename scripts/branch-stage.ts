import { spawnSync } from "node:child_process";

export const PROTECTED_BRANCHES = new Set(["main", "master", "prod", "production"]);

function git(args: string[]) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

export function currentBranch() {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch || branch === "HEAD") {
    throw new Error("Cannot deploy a branch preview from a detached HEAD.");
  }
  return branch;
}

export function currentCommit() {
  return git(["rev-parse", "HEAD"]);
}

export function stageFromBranch(branch: string) {
  const stage = branch
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48);

  if (!stage) {
    throw new Error(`Branch '${branch}' cannot be converted into a valid Alchemy stage.`);
  }

  return stage;
}

export function assertPreviewBranch(branch: string) {
  if (PROTECTED_BRANCHES.has(branch) && process.env.ALLOW_PROTECTED_PREVIEW !== "1") {
    throw new Error(
      `Refusing to auto-deploy protected branch '${branch}'. ` +
        "Use an explicit production/staging deploy, or set ALLOW_PROTECTED_PREVIEW=1 if you really mean it.",
    );
  }
}

export function previewContext(options: { allowProtected?: boolean } = {}) {
  const branch = currentBranch();
  if (!options.allowProtected) {
    assertPreviewBranch(branch);
  }
  return {
    branch,
    stage: stageFromBranch(branch),
    commit: currentCommit(),
  };
}
