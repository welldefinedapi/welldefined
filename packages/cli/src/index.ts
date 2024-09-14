import * as yargs from "yargs";
import mergeCommand from "./merge";
import transform from "./transform";

yargs
  .command(
    "merge [yamls...]",
    "Merge two or more YAML files",
    (yargs) =>
      yargs
        .positional("yamls", {
          array: true,
          type: "string",
          demandOption: true,
        })
        .option({
          output: {
            description: "Output file.",
            alias: "o",
            type: "string",
          },
        }),
    async function (argv) {
      await mergeCommand(argv);
    },
  )
  .command("transform [yaml]", "Transform a YAML file", (yargs) =>
    yargs
      .positional("yaml", {
        type: "string",
        demandOption: true,
      })
      .option({
        command: {
          description:
            "The jq.node command, refer to the jq.node README for more info.",
          alias: "c",
          demandOption: true,
          type: "string",
        },
        output: {
          description: "Output file.",
          alias: "o",
          type: "string",
        },
      }),
    async (argv) => await transform(argv),
  )
  .help().argv;
