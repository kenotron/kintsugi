import * as minimist from 'minimist';
import ArgvOptions from './ArgvOptions';

// commands
import init from './commands/init';
import run from './commands/run';

const argv: ArgvOptions = minimist(process.argv.slice(2));
const command = argv['_'] && argv['_'].length > 0 ? argv['_'][0] : 'run';

run(argv);