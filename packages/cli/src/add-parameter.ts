import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import { isMatch } from "micromatch";

export interface AddParameterArgs {
  yaml: string;
  parameter: string;
  endpoints: string;
  methods: string[];
  output?: string;
}

const finalize = async (data: string, output?: string) => {
  if (output) {
    await fs.writeFile(output, data, { encoding: "utf8" });
  } else {
    console.log(data);
  }
};

export default async function addParameter(args: AddParameterArgs) {
  const content = await fs.readFile(args.yaml, { encoding: "utf8" });
  const json = yaml.load(content.toString());

  if (!isObject(json) || !("paths" in json) || !isObject(json["paths"])) {
    return await finalize(content.toString(), args.output);
  }

  const paths: Record<string, any> = json["paths"];
  const endpoints = Object.keys(paths);
  const endpointGlobs = args.endpoints.split(",");
  const parameterJson = yaml.load(args.parameter) as any;

  for (const endpoint of endpoints) {
    // console.debug(endpoint, args.endpoints, isMatch(endpoint, endpointGlobs))
    if (!isMatch(endpoint, endpointGlobs)) {
      continue;
    }

    const endpointData = paths[endpoint];
    const methods = Object.keys(endpointData);
    for (const method of methods) {
      if (!args.methods.includes(method) || !isObject(endpointData[method])) {
        continue;
      }

      const methodData: Record<string, any> = endpointData[method];
      if (!isObject(methodData) || !methodData["parameters"]) {
        continue;
      }

      const parameters: Record<string, any>[] = methodData["parameters"];
      if (!Array.isArray(parameters)) {
        continue;
      }

      parameters.push(parameterJson);
    }
  }

  const resultYaml = yaml.dump(json);
  await finalize(resultYaml, args.output);
}
