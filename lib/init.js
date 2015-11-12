var execSync = require('child_process').execSync;
var spawnSync = require('child_process').spawnSync;
var path = require('path');
var fs = require('fs');
var os = require('os');
var semver = require('semver');

module.exports = function(env) {
	if (semver.lt(process.version, '4.2.1')) {
		console.log("Please upgrade your node version to at least 4.2.1 (current Long Term Supported version)");
		return;
	}
	
	var npmVersion = execSync('npm --version');
	console.log("Your current npm is version: " + npmVersion.toString());

	if (semver.lt(npmVersion.toString().replace(/^\s*|\s*$/g, ''), '3.3.10')) {
		console.log("npm needs to be upgraded");
		
		if (os.platform() == 'win32') {
			var results = execSync('npm install -g npm-windows-upgrade');
			console.log(results);
			
			results = execSync('powershell Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force');
			console.log(results);
			
			results = execSync('powershell npm-windows-upgrade --version:3.3.10 --no-prompt');
			console.log(results);
		} else {
			execSync('npm install -g npm');
		}
	}

	try {
		execSync('npm list -g yo', {stdio: 'inherit'});
	} catch(e) {
		console.log('Installing global dependencies');
		execSync('npm install -g yo', {stdio: 'inherit'});
	}
	
	if (!fs.existsSync('package.json')) {
		console.log('The current directory does not contain project files (package.json), scaffolding a new application:');
		
		var args = [];
		args.push(env.argv["_"].join(" "));
		
		if (env.argv["stack"]) {
			args.push("--stack " + env.argv["stack"]);
		}
		
		execSync('yo kintsugi ' + args.join(" "), {stdio: 'inherit'});
	}
	
	console.log("You can now add new packages with 'k new [package]' or begin working on a package by 'k dev [package]'");
}