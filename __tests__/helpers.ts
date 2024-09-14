import { spawnSync } from "child_process";

export function getCommandOutput(params: string[], folderPath: string) {
  const result = spawnSync("node", params, {
    cwd: folderPath,
    env: {
      ...process.env,
      NODE_ENV: "test",
      NO_COLOR: "TRUE",
    },
  });
  const out = result.stdout.toString("utf-8");
  const err = result.stderr.toString("utf-8");
  return { out, err };
}
