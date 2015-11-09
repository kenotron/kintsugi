var path = require('path');

var steps = {
	init: [],
	build: [],
	dev: [],
	//package: []
};

function addDefaultStepFunctions() {
	Object.keys(steps).forEach(function(step) {
		var commandLibPath = path.resolve(__dirname, 'lib', step);
		var commandLib = require(commandLibPath); 
		if (commandLib) {
			addStepFunction(step, commandLib);
		}	
	});
}

function addStepFunction(step, fn) {
	if (steps[step]) {
		steps[step].push(fn);
	}
}

module.exports.addStepFunction = addStepFunction;

module.exports.executeStep = function(step, env) {
	if (!steps[step]) {
		return;
	}
	
	steps[step].forEach(function(f) {
		f(env);
	});
}

addDefaultStepFunctions();