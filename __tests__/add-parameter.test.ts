import path from "path";
import fs from "fs";

import { getCommandOutput } from "./helpers";

test("add-parameter - no-params.output1", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "no-params.yaml",
      "--parameter",
      '$ref: "#/components/parameters/IdempotencyKey"',
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/no-params.output1.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - no-params.output2", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "no-params.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string"}}',
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/no-params.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - no-params.output3", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "no-params.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string"}}',
      "--endpoints",
      "/objects/**",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/no-params.output3.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - no-params - no matching methods", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "no-params.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string"}}',
      "--methods",
      "post,patch",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      // Matches the input
      path.join(__dirname, "data/add-parameter/no-params.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - has-refs.output1", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-refs.yaml",
      "--parameter",
      '$ref: "#/components/parameters/IdempotencyKey"',
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/has-refs.output1.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - has-refs - no matching methods", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-refs.yaml",
      "--parameter",
      '$ref: "#/components/parameters/IdempotencyKey"',
      "--methods",
      "post,patch",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      // Matches the input
      path.join(__dirname, "data/add-parameter/has-refs.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

// TODO: This test shows that inline parameters are not deduplicated against ref objects.
// A smarter add-parameter would take referenced parameter name+in into account
test("add-parameter - has-refs.output2", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-refs.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string"}}',
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/has-refs.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - has-inline.output1", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-inline.yaml",
      "--parameter",
      '$ref: "#/components/parameters/IdempotencyKey"',
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/has-inline.output1.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toBe("");
  expect(out).toBe(expected);
});

test("add-parameter - has-inline.output2", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-inline.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string","maxLength":36}}',
      "--force",
    ],
    folderPath,
  );
  const expected = fs
    .readFileSync(
      path.join(__dirname, "data/add-parameter/has-inline.output2.yaml"),
      { encoding: "utf8" },
    )
    .toString();
  expect(err).toContain("");
  expect(out).toBe(expected);
});

test("add-parameter - has-inline - bail without --force", async () => {
  const folderPath = path.join(__dirname, "data/add-parameter");
  const { out, err } = getCommandOutput(
    [
      "../../../packages/cli/bin/cli.js",
      "add-parameter",
      "has-inline.yaml",
      "--parameter",
      '{"name":"Idempotency-Key","in":"header","schema":{"type":"string","maxLength":36}}',
    ],
    folderPath,
  );
  expect(err).toContain(`Error: Refusing to add a parameter with name+in that's already in the list. Use --force to overwrite the matching parameter. Details: {\"yaml\":\"has-inline.yaml\",\"endpoint\":\"/objects/{id}\",\"method\":\"get\",\"parameters\":[{\"in\":\"header\",\"name\":\"Idempotency-Key\",\"schema\":{\"type\":\"string\"}}],\"additionalParameter\":{\"name\":\"Idempotency-Key\",\"in\":\"header\",\"schema\":{\"type\":\"string\",\"maxLength\":36}}}`);
  expect(out).toBe("");
});
