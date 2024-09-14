import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import { isMatch } from "micromatch";

export interface TransformMethodArgs {
  yaml: string;
  from: string;
  to: string;
  endpoints: string;
  output?: string;
}

const finalize = async (data: string, output?: string) => {
  if (output) {
    await fs.writeFile(output, data, { encoding: "utf8" });
  } else {
    console.log(data);
  }
};

export default async function transformMethod(args: TransformMethodArgs) {
  const content = await fs.readFile(args.yaml, { encoding: "utf8" });
  const json = yaml.load(content.toString());

  if (!isObject(json) || !("paths" in json) || !isObject(json["paths"])) {
    return await finalize(content.toString(), args.output);
  }

  const paths: Record<string, any> = json["paths"];
  const endpoints = Object.keys(paths);
  const endpointGlobs = args.endpoints.split(",");

  for (const endpoint of endpoints) {
    // console.debug(endpoint, args.endpoints, isMatch(endpoint, endpointGlobs))
    if (!isMatch(endpoint, endpointGlobs)) {
      continue;
    }
    const { from, to } = args;
    const endpointData = paths[endpoint];
    if (!(from in endpointData)) {
      continue;
    }
    endpointData[to] = endpointData[from];
    delete endpointData[from];
  }

  const resultYaml = yaml.dump(json);
  await finalize(resultYaml, args.output);
}
