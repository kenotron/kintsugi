var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var execSync = require('child_process').execSync;
var collectPackages = require('./packages').collectPackages;

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function npmLink(basePath, targetBasePath, packageName) {
	// i.e. root\node_modules
	var nodeModulesPath = path.resolve(basePath, "node_modules");
	// i.e. root\node_modules\kintsugi-build
	var targetPackagePath = path.resolve(nodeModulesPath, packageName);

	// i.e. target\root\packages
	var packagesPath = path.resolve(targetBasePath, "packages");
	// i.e. target\root\packages\kintsugi-build
	var packagePath = path.resolve(packagesPath, packageName);

	if (!fs.existsSync(path.resolve(packagePath))) {
		fs.mkdirSync(path.resolve(packagePath));
	}

	// link root\packages\kintsugi-build -> target\root\packages\kintsugi-build
	fs.symlinkSync(packagePath, targetPackagePath, "dir");
	fs.symlinkSync(nodeModulesPath, path.resolve(packagePath, "node_modules"), "dir");
}

function cleanLinks(basePath, targetBasePath, packageName) {
	// i.e. root\node_modules
	var nodeModulesPath = path.resolve(basePath, "node_modules");
	// i.e. root\node_modules\kintsugi-build
	var targetPackagePath = path.resolve(nodeModulesPath, packageName);

	// i.e. target\root\packages
	var packagesPath = path.resolve(targetBasePath, "packages");
	// i.e. target\root\packages\kintsugi-build
	var packagePath = path.resolve(packagesPath, packageName);

	try {
		fs.unlinkSync(path.resolve(packagePath, "node_modules"));
	} catch(e) {
		// pass
	}

	try {
		fs.unlinkSync(path.resolve(targetPackagePath));
	} catch(e) {
		// pass
	}
}

module.exports = function(env) {
	var targetBasePath = env.argv["t"] || "built";

	if (!fs.existsSync(path.resolve(targetBasePath, 'packages'))) {
		mkdirp.sync(path.resolve(targetBasePath, 'packages'));
	}

	var baseDir = process.env["NODE_PATH"] ? path.resolve(process.env["NODE_PATH"], '..') : path.resolve(env.cwd);

	var packages = collectPackages("packages");

	console.log("Prepping deps, basedir: " + baseDir);

	packages.forEach(function(packageDir) {
		var packageName = path.basename(packageDir);

		console.log("cleaning up for " + packageName);
		cleanLinks(baseDir, targetBasePath, packageName);
	});

	packages.forEach(function(packageDir) {
		var packageName = path.basename(packageDir);

		console.log("npm linking for " + packageName);
		npmLink(baseDir, targetBasePath, packageName);
	});
	
	console.log("NOTE: all the node_modules in packages subdirectories are SYMLINKed from the main node_modules in the root directory of root")
}
