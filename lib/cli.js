"use strict";
var minimist = require('minimist');
var run_1 = require('./commands/run');
var argv = minimist(process.argv.slice(2));
var command = argv['_'] && argv['_'].length > 0 ? argv['_'][0] : 'run';
run_1.default(argv);
