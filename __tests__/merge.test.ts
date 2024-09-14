import path from "path";
import fs from "fs";

import { getCommandOutput } from "./helpers";

test("merge - a.yml b.yml to c.yml", async () => {
  const folderPath = path.join(__dirname, "data/merge-a-b-to-c");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "merge",
      "a.yml",
      "b.yml",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/merge-a-b-to-c/c.yml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});
