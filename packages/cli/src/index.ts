import * as yargs from 'yargs';
import mergeCommand from './merge';

yargs.command('merge [yamls...]', "Merge two or more YAML files",
  (yargs) =>
    yargs
        .positional('yamls', {
          array: true,
          type: 'string',
          demandOption: true,
        })
        .option({
          'output': {
            description: 'Output file.',
            alias: 'o',
            type: 'string',
          }
        }),
  async function (argv) {
    await mergeCommand(argv);
  })
  .help()
  .argv
