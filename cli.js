var path = require('path');
var Liftoff = require('liftoff');
var kintsugi = require('./kintsugi');

var argv = process.argv.slice(2);
var args = require('minimist')(argv);

var commandList = args["_"];

var cli = new Liftoff({
	name: 'kintsugi',
	extensions: { '.json': null }
});

cli.on('require', function(name, module) {
	console.log('Loading external module:', name);
});

cli.on('requireFail', function(name, err) {
	console.log('Unable to load:', name, err);
});

cli.launch({
	cwd: args["cwd"] || process.cwd()	
}, function(env) {
	if (commandList.length == 0) {
		showUsage();
		process.exit(0);
	}
	
	if (env.configPath) {
		env.config = require(env.configPath);
	}
	
	env.args = args;
	env.argv = argv;
	
	var command = commandList[0];
	
	kintsugi.executeStep(command, env);
});

function showUsage() {
	console.log("k [command] [options]");
}