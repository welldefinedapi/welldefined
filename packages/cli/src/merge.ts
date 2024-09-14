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

const mergeCommand = async (args: MergeArgs) => {
  let temp = undefined;
  for (const filepath of args.yamls) {
    const file = await fs.readFile(filepath, { encoding: "utf8" });
    const content = yaml.load(file.toString());
    temp = mergeWith(temp, content, (obj: any, src: any, key: string) => {
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
      // console.log(obj, src, key)
    });
  }
  const merged = yaml.dump(temp);
  if (args.output) {
    await fs.writeFile(args.output, merged, { encoding: "utf8" });
  } else {
    console.log(merged);
  }
};

export default mergeCommand;
