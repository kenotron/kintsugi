var path = require('path');
var Liftoff = require('liftoff');
var kintsugi = require('./kintsugi');
var argv = require('minimist')(process.argv.slice(2));

var command = argv["_"].length > 0 ? argv["_"][0] : null;

var cli = new Liftoff({
	name: 'kintsugi'
});

cli.on('require', function(name, module) {
	console.log('Loading external module:', name);
});

cli.on('requireFail', function(name, err) {
	console.log('Unable to load:', name, err);
});

cli.launch({
	cwd: argv["cwd"] || process.cwd()	
}, function(env) {
	if (!command) {
		showUsage();
		process.exit(0);	
	}
	
	argv["_"] = argv["_"].slice(1); // skip the command
	env.argv = argv;
	
	kintsugi.executeStep(command, env);
});

function showUsage() {
	console.log("k [command] [options]");
}