import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import toString from "lodash.tostring";
import { isMatch } from "micromatch";

export interface ChangeResponseStatusArgs {
  yaml: string;
  from: number;
  to: number;
  endpoints: string;
  methods: string;
  output?: string;
}

const finalize = async (data: string, output?: string) => {
  if (output) {
    await fs.writeFile(output, data, { encoding: "utf8" });
  } else {
    process.stdout.write(data);
  }
};

const validateArgs = (args: ChangeResponseStatusArgs) => {
  if (!range(100, 999).contains(args.from)) {
    throw new Error(`Invalid source HTTP response status (--from): ${args.from}. Must be in between 100 and 999.`);
  }
  if (!range(100, 999).contains(args.to)) {
    throw new Error(`Invalid target HTTP response status (--to): ${args.to}. Must be in between 100 and 999.`);
  }
}

const range = (min: number, max: number) => {
  return {
    contains: (value: number): boolean => {
      return value >= min && value <= max;
    },
  };
};

export default async function changeResponseStatus(args: ChangeResponseStatusArgs) {
  validateArgs(args);
  const content = await fs.readFile(args.yaml, { encoding: "utf8" });
  const json = yaml.load(content.toString());

  if (!isObject(json) || !("paths" in json) || !isObject(json["paths"])) {
    return await finalize(content.toString(), args.output);
  }

  const paths: Record<string, any> = json["paths"];
  const endpoints = Object.keys(paths);
  const endpointGlobs = args.endpoints;
  const methodGlobs = args.methods;

  for (const endpoint of endpoints) {
    if (!isMatch(endpoint, endpointGlobs)) {
      continue;
    }

    const methods = Object.keys(paths[endpoint]);
    for (const method of methods) {
      if (!isMatch(method, methodGlobs)) {
        continue;
      }

      const { from, to } = args;
      const responsesData = ((paths[endpoint] ?? {})[method] ?? {})['responses'];

      // Skip if the 'responses' object is empty.
      if (!responsesData) {
        console.warn(`Skipping, missing 'responses' field. endpoint=${endpoint} method=${method}`)
        continue;
      }

      // Skip if the source response status is missing.
      if (!(toString(from) in responsesData)) {
        console.warn(`Skipping, missing source response status. endpoint=${endpoint} method=${method} from=${from}`);
        continue;
      }

      // Check if there already exists data for the target response status to transform into.
      if (toString(to) in responsesData) {
        throw new Error(`Refusing to overwrite existing response status. endpoint=${endpoint} method=${method}`);
      }

      // Finally, transform the source response status into the target response status.
      responsesData[toString(to)] = responsesData[toString(from)];
      delete responsesData[toString(from)];
    }
    
  }

  const resultYaml = yaml.dump(json, {
    noRefs: true,
    quotingType: '"',
  });
  await finalize(resultYaml, args.output);
}
