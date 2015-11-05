var path = require('path');
var fs = require('fs');
var toposort = require('toposort');
var assign = require('object-assign');

function getDependencies(packageBasePath, packagePath) {
	var packageJson = JSON.parse(fs.readFileSync(path.resolve(packageBasePath, packagePath, "package.json")).toString());
	var depsMap = {};

	if ('dependencies' in packageJson) {
		assign(depsMap, packageJson.dependencies);	
	}
	
	if ('devDependencies' in packageJson) {
		assign(depsMap, packageJson.devDependencies);	
	}
	
	var deps = Object.keys(depsMap).filter(function(d) { return d.indexOf("owa") == 0 });
	return deps;
}

function getAllDependencies(packageBasePath, rootPackagePaths, depth) {
	var graph = [];
	var stack = [];

	rootPackagePaths.forEach(p => stack.push([p, 0]));
	
	while (stack.length > 0) {
		var item = stack.pop();
		
		var packagePath = item[0];
		var level = item[1];
		
		if (level < depth || depth == 0) {
			var deps = getDependencies(packageBasePath, packagePath);
				
			deps.forEach(child => {
				graph.push([child, path.basename(packagePath)]);
				stack.push([child, level + 1]);
			});	
		}
	}
	
	return toposort(graph);
}

module.exports.collectPackages = function collectPackages(packageBasePath, packagePaths, depth) {
	packagePaths = packagePaths || ["owa-application"];
	depth = depth || 0;
	return getAllDependencies(packageBasePath, packagePaths, depth);
}
