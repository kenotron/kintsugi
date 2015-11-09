// Imports
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var os = require('os');
var collectPackages = require('./packages').collectPackages;
var execSync = require('child_process').execSync;

// An override for v8flags so that it doesn't try to execFile() on node with stdio being "pipe" 
function overrideV8FlagsWithCache() {
	var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
	var configfile = '.v8flags.' + process.versions.v8 + '.' + user + '.json';
	var sourceConfigPath = path.resolve(__dirname, "v8flags.json");
	var userHome = require('user-home');
	var targetConfigPath = path.join(userHome || os.tmpdir(), configfile); 
	fs.writeFileSync(targetConfigPath, fs.readFileSync(sourceConfigPath));	
}

module.exports = function(env) {
	overrideV8FlagsWithCache();
	
	// Globals
	var packagesPath = "packages";
	var outDir = path.resolve(process.env["INETROOT"], 'target/dev/owa/clientnext/debug/amd64/packages');
	var buildCommand = "build";
	var doLink = false;
	
	if (env.argv["p"]) {
		packagesPath = env.argv["p"];
		doLink = true;
		buildCommand = "build:release";
		outDir = packagesPath;
	}
	
	var packageList = collectPackages(packagesPath);
	var nodePath = process.env["NODE_PATH"] ? path.resolve(process.env["NODE_PATH"]) : path.resolve(__dirname, "..", "node_modules"); 
	
	packageList.forEach(function(p) {
		var command = '"' + process.execPath + '" "' + nodePath + '/gulp/bin/gulp.js" ' + buildCommand;
		if (packagesPath != "packages") {
			command += ' --packagesPath "' + packagesPath + '"';
		}
				
		console.log("Running: " + command + " in " + path.resolve(packagesPath, p));
		try {
			execSync(command, {cwd: path.resolve(packagesPath, p), stdio: "inherit"});
		} catch(e) {
			console.log("[" + p + "] Error: " + e.message);
			console.log("[" + p + "] Stack Trace: " + e.stack);
			
			// Bail, since we encountered errors.
			process.exit(1);
		}
		
		if (doLink && !fs.existsSync(path.resolve(nodePath, p))) {
			fs.symlinkSync(path.resolve(packagesPath, p), path.resolve(nodePath, p), "dir");
		}
	});	
}
