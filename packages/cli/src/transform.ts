import { jq } from "jq.node";
import { promises as fs } from "fs";
import yaml from "js-yaml";

export interface TransformArgs {
  yaml: string;
  command: string;
  output?: string;
}

export default async function transform(args: TransformArgs) {
  const content = await fs.readFile(args.yaml, { encoding: "utf8" });
  const json = yaml.load(content.toString());
  const jsonStr = JSON.stringify(json);
  console.log(jsonStr)

  const transformed = await new Promise((resolve, reject) => {
    jq(jsonStr, args.command, { rawInput: false }, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  const resultYaml = yaml.dump(transformed);
  if (args.output) {
    await fs.writeFile(args.output, resultYaml, { encoding: "utf8" });
  } else {
    console.log(resultYaml);
  }
}
