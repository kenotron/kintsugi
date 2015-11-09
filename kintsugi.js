var path = require('path');

var orderedSteps = ['init', 'build'];

var steps = {
	init: [],
	build: [],
	//dev: [],
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
	
	var index = 0;
	var currentStep;
	
	while (true) {
		currentStep = orderedSteps[index++];
		
		steps[currentStep].forEach(function(f) {
			f(env);
		});
		
		if (currentStep == step) {
			break;
		}	
	}
}

addDefaultStepFunctions();