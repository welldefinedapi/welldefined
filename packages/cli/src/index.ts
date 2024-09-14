import * as yargs from "yargs";
import mergeCommand from "./merge";
import transformMethod from "./transform-method";
import addParameter from "./add-parameter";

const httpMethodChoices = [
  "get",
  "head",
  "options",
  "trace",
  "put",
  "delete",
  "post",
  "patch",
  "connect",
];

yargs
  .command(
    "merge [yamls...]",
    "Merge two or more YAML files.",
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
    (argv) => mergeCommand(argv),
  )
  .command(
    "transform-method [yaml]",
    "Transform HTTP methods in a YAML OpenAPI spec.",
    (yargs) =>
      yargs
        .positional("yaml", {
          type: "string",
          demandOption: true,
        })
        .option({
          from: {
            description: "The HTTP method to match and transform from.",
            alias: "f",
            demandOption: true,
            type: "string",
            choices: httpMethodChoices,
          },
          to: {
            description:
              "The HTTP method to transform the matching HTTP method to.",
            alias: "t",
            demandOption: true,
            type: "string",
            choices: httpMethodChoices,
          },
          endpoints: {
            description:
              "A glob pattern matching the endpoints to apply the transformation to.",
            alias: "e",
            type: "string",
            default: "**",
          },
          output: {
            description: "Output file.",
            alias: "o",
            type: "string",
          },
        }),
    (argv) => transformMethod(argv),
  )
  .command(
    "add-parameter [yaml]",
    "Adds a parameter to endpoints in a YAML OpenAPI spec.",
    (yargs) =>
      yargs
        .positional("yaml", {
          type: "string",
          demandOption: true,
        })
        .option({
          parameter: {
            description: "The parameter to add in YAML format.",
            alias: "p",
            type: "string",
            demandOption: true,
          },
          endpoints: {
            description:
              "A glob pattern matching the endpoints to apply the transformation to.",
            alias: "e",
            type: "string",
            default: "**",
          },
          methods: {
            description:
              "A comma separated list of the HTTP methods to apply the parameter to.",
            alias: "m",
            type: "string",
            default: httpMethodChoices.join(","),
          },
          output: {
            description: "Output file.",
            alias: "o",
            type: "string",
          },
          force: {
            description:
              "Forcefully add parameter, overwriting any existing parameter if the name+in match.",
            alias: "f",
            type: "boolean",
            default: false,
          },
        }),
    (argv) =>
      addParameter({
        ...argv,
        methods: argv.methods.split(","),
      }),
  )
  .help("help")
  .alias("h", "help")
  .alias("v", "version").argv;
