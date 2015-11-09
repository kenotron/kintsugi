var execSync = require('child_process').execSync;


module.exports = function(env) {
	console.log(env);
	execSync('node node_modules/yo/cli.js kintsugi');
}