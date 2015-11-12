var execSync = require('child_process').execSync;
var fs = require('fs');
var os = require('os');
var semver = require('semver');

module.exports = function(env) {
	console.log('Creating new package');
	
	execSync('yo kintsugi:package ' + env.argv["_"].join(" "), {stdio: 'inherit'});
}