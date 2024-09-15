import path from "path";
import fs from "fs";

import { getCommandOutput } from "./helpers";

test("change-method - object.oas3.output1", async () => {
  const folderPath = path.join(__dirname, "data/change-method");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-method",
      "object.oas3.yaml",
      "--from",
      "post",
      "--to",
      "patch",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/change-method/object.oas3.output1.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("change-method - object.oas3.output2 glob:/objects/*", async () => {
  const folderPath = path.join(__dirname, "data/change-method");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-method",
      "object.oas3.yaml",
      "--from",
      "post",
      "--to",
      "patch",
      "--endpoints",
      "/objects/*",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/change-method/object.oas3.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("change-method - object.oas3.output2 glob:/{objects,}/*", async () => {
  const folderPath = path.join(__dirname, "data/change-method");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-method",
      "object.oas3.yaml",
      "--from",
      "post",
      "--to",
      "patch",
      "--endpoints",
      "/{objects,}/*",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/change-method/object.oas3.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("change-method - object.oas3.output2 glob:/{objects,parts}/*", async () => {
  const folderPath = path.join(__dirname, "data/change-method");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "change-method",
      "object.oas3.yaml",
      "--from",
      "post",
      "--to",
      "patch",
      "--endpoints",
      "/{objects,parts}/*",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/change-method/object.oas3.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});
