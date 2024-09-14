import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import { isMatch } from "micromatch";

export interface ChangeMethodArgs {
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
    process.stdout.write(data);
  }
};

export default async function changeMethod(args: ChangeMethodArgs) {
  const content = await fs.readFile(args.yaml, { encoding: "utf8" });
  const json = yaml.load(content.toString());

  if (!isObject(json) || !("paths" in json) || !isObject(json["paths"])) {
    return await finalize(content.toString(), args.output);
  }

  const paths: Record<string, any> = json["paths"];
  const endpoints = Object.keys(paths);
  const endpointGlobs = args.endpoints.split(",");

  for (const endpoint of endpoints) {
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

  const resultYaml = yaml.dump(json, {
    noRefs: true,
    quotingType: '"',
  });
  await finalize(resultYaml, args.output);
}
