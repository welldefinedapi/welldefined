import { promises as fs } from "fs";
import yaml from "js-yaml";
import isObject from "lodash.isobject";
import isString from "lodash.isstring";
import { isMatch } from "micromatch";
import { isRefObject } from "./openapi/ref";

export interface AddParameterArgs {
  yaml: string;
  parameter: string;
  endpoints: string;
  methods: string[];
  force: boolean;
  output?: string;
}

const finalize = async (data: string, output?: string) => {
  if (output) {
    await fs.writeFile(output, data, { encoding: "utf8" });
  } else {
    console.log(data);
  }
};

/**
 * Calculates a key identifier for the parameter.
 * 1. If obj contains `$ref`, use the ref value as the key.
 * 2. Else if obj contains string values for both "name" and "in",
 *    use the JSON serialized version of `name + in` to keep order.
 *    Refer to message "Sibling parameters must have unique name + in values"
 *    in validator at https://github.com/swagger-api/swagger-editor/blob/8d73656cea2687f5e0a9b781c165bd40ccf2a9ce/src/plugins/validate-semantic/validators/2and3/parameters.js#L21
 * 3. Else return null (no key identified)
 */
const parameterKey = (obj: any): string | null => {
  if (!isObject(obj)) {
    return null;
  }
  if (isRefObject(obj)) {
    return obj["$ref"];
  } else if (
    "in" in obj &&
    "name" in obj &&
    isString(obj["in"] && isString(obj["name"]))
  ) {
    return JSON.stringify([obj["name"], obj["in"]]);
  } else {
    return null;
  }
};

const overwrite = (parameters: object[], newParameter: object) => {
  const newParameterKey = parameterKey(newParameter);
  if (!newParameterKey) {
    return;
  }
  const index = parameters.findIndex(
    (parameter) => parameterKey(parameter) === newParameterKey,
  );
  if (index < 0) {
    return;
  }
  parameters.splice(index, 1, newParameter);
};

const alreadyIn = (parameters: object[], candidate: any): boolean => {
  const candidateKey = parameterKey(candidate);
  if (!candidateKey) {
    return false;
  }
  const existingKeys = parameters
    .map(parameterKey)
    .filter((k) => k !== null)
    .reduce<Record<string, boolean>>((keyMap, key) => {
      keyMap[key] = true;
      return keyMap;
    }, {});
  return existingKeys[candidateKey] ?? false;
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

      if (alreadyIn(parameters, parameterJson)) {
        // Skip if the new parameter is a ref object that already exists.
        if (isRefObject(parameterJson)) {
          continue;
          // If we are asked to add the parameter forcefully, overwrite
          // the existing one with the new parameter data.
        } else if (args.force) {
          overwrite(parameters, parameterJson);
          // Else bail out.
        } else {
          const details = {
            endpoint,
            method,
            parameters,
            additionalParameter: parameterJson,
          };
          throw new Error(
            "Refusing to add a parameter with name+in that's already in the list. Details: " +
              JSON.stringify(details),
          );
        }
      } else {
        parameters.push(parameterJson);
      }
    }
  }

  const resultYaml = yaml.dump(json);
  await finalize(resultYaml, args.output);
}
