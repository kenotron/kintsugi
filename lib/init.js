var execSync = require('child_process').execSync;
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
			execSync('npm install -g npm-windows-upgrade')
			execSync('powershell Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force & powershell npm-windows-upgrade --version:3.3.10 --no-prompt');
		} else {
			execSync('npm install -g npm');
		}
	}

	console.log('Installing global dependencies');
	execSync('npm install -g yo typescript@next webpack webpack-dev-server')
	
	if (!fs.existsSync('package.json')) {
		console.log('The current directory does not contain project files (package.json), scaffolding a new application:');
		execSync('yo kintsugi', {stdio: 'inherit'});
	}
	
	console.log("You can now add new packages with 'k new [package]' or begin working on a package by 'k dev [package]'");
}