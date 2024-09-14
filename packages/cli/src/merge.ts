import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import isString from "lodash.isstring";
import mergeWith from "lodash.mergewith";

export interface MergeArgs {
  yamls: string[];
  output?: string;
}

const refKey = (obj: any): string | null => {
  if (!isObject(obj)) {
    return null;
  }
  if ("$ref" in obj && isString(obj["$ref"])) {
    return obj["$ref"];
  } else {
    return null;
  }
};

/**
 * Handles $ref objects as unique items in an array.
 * @param obj Destination array
 * @param src Source array
 */
const refMerger = (obj: any, src: any) => {
  if (Array.isArray(obj) && Array.isArray(src)) {
    const visited: Record<string, any> = {};
    for (const item of obj) {
      const key = refKey(item) ?? JSON.stringify(item);
      if (key) {
        visited[key] = true;
      }
    }
    for (const item of src) {
      const key = refKey(item) ?? JSON.stringify(item);
      // was a ref and resolved to the same value, so skip
      if (key && visited[key]) {
        continue;
      }
      obj.push(item);
    }
    return obj;
  }
};

const mergeCommand = async (args: MergeArgs) => {
  let combined = undefined;
  for (const filepath of args.yamls) {
    const file = await fs.readFile(filepath, { encoding: "utf8" });
    const content = yaml.load(file.toString());
    combined = mergeWith(combined, content, refMerger);
  }
  const resultYaml = yaml.dump(combined);
  if (args.output) {
    await fs.writeFile(args.output, resultYaml, { encoding: "utf8" });
  } else {
    console.log(resultYaml);
  }
};

export default mergeCommand;
