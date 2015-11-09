var path = require('path');
var Liftoff = require('liftoff');
var kintsugi = require('./kintsugi');
var argv = require('minimist')(process.argv.slice(2));

var commandList = argv["_"];

var cli = new Liftoff({
	name: 'kintsugi'
});

cli.on('require', function(name, module) {
	console.log('Loading external module:', name);
});

cli.on('requireFail', function(name, err) {
	console.log('Unable to load:', name, err);
});

cli.launch({}, function(env) {
	if (commandList.length != 1) {
		showUsage();
		process.exit(0);	
	}
	
	env.argv = argv;
	
	var command = commandList[0];
	
	kintsugi.executeStep(command, env);
});

function showUsage() {
	console.log("k [command] [options]");
}