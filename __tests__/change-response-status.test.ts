import path from "path";
import fs from "fs";

import { getCommandOutput } from "./helpers";

test("change-response-status - object.oas3.output1", async () => {
  const folderPath = path.join(__dirname, "data/change-response-status");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-response-status",
      "object.oas3.yaml",
      "--from",
      "200",
      "--to",
      "201",
      "--endpoints",
      "/objects/*",
      "--methods",
      "post",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(
        __dirname,
        "data/change-response-status/object.oas3.output1.yaml",
      ),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("change-response-status - target response status exists", async () => {
  const folderPath = path.join(__dirname, "data/change-response-status");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-response-status",
      "object.oas3.exists.yaml",
      "--from",
      "200",
      "--to",
      "201",
      "--endpoints",
      "/objects/*",
      "--methods",
      "post",
    ],
    folderPath,
  );
  expect(out).toBe("");
  expect(err).toContain(
    "Error: Refusing to overwrite existing response status. endpoint=/objects/{id} method=post",
  );
});

test("change-response-status - skipped if source response status is missing", async () => {
  const folderPath = path.join(__dirname, "data/change-response-status");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-response-status",
      "object.oas3.skipped.yaml",
      "--from",
      "200",
      "--to",
      "201",
      "--endpoints",
      "/objects/*",
      "--methods",
      "post",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(
        __dirname,
        "data/change-response-status/object.oas3.skipped.yaml",
      ),
      { encoding: "utf8" },
    )
    .toString();
  expect(out).toBe(expected);
  expect(err).toContain(
    "Skipping, missing source response status. endpoint=/objects/{id} method=post from=200",
  );
});

test("change-response-status - invalid from", async () => {
  const folderPath = path.join(__dirname, "data/change-response-status");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-response-status",
      "object.oas3.skipped.yaml",
      "--from",
      "1",
      "--to",
      "201",
      "--endpoints",
      "/objects/*",
      "--methods",
      "post",
    ],
    folderPath,
  );
  expect(out).toBe("");
  expect(err).toContain(
    "Invalid source HTTP response status (--from): 1. Must be in between 100 and 999.",
  );
});

test("change-response-status - invalid to", async () => {
  const folderPath = path.join(__dirname, "data/change-response-status");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-response-status",
      "object.oas3.skipped.yaml",
      "--from",
      "200",
      "--to",
      "20",
      "--endpoints",
      "/objects/*",
      "--methods",
      "post",
    ],
    folderPath,
  );
  expect(out).toBe("");
  expect(err).toContain(
    "Invalid target HTTP response status (--to): 20. Must be in between 100 and 999.",
  );
});
