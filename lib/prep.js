var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var execSync = require('child_process').execSync;
var collectPackages = require('./packages').collectPackages;

var targetBasePath = path.resolve(process.env["INETROOT"], 'target/dev/owa/clientnext/debug/amd64');

if (!fs.existsSync(path.resolve(targetBasePath, 'packages'))) {
	mkdirp.sync(path.resolve(targetBasePath, 'packages'));	
}

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

function npmLink(basePath, packageName) {
	// i.e. ClientNext\node_modules
	var nodeModulesPath = path.resolve(basePath, "node_modules");
	// i.e. ClientNext\node_modules\owa-build
	var targetPackagePath = path.resolve(nodeModulesPath, packageName);
	
	// i.e. target\dev\owa\ClientNext\packages
	var packagesPath = path.resolve(targetBasePath, "packages");
	// i.e. target\dev\owa\ClientNext\packages\owa-build
	var packagePath = path.resolve(packagesPath, packageName);
	
	if (!fs.existsSync(path.resolve(packagePath))) {
		fs.mkdirSync(path.resolve(packagePath));	
	}
	
	// link ClientNext\packages\owa-build -> target\dev\owa\ClientNext\packages\owa-build
	fs.symlinkSync(packagePath, targetPackagePath, "dir");
	fs.symlinkSync(nodeModulesPath, path.resolve(packagePath, "node_modules"), "dir");
}

function cleanLinks(basePath, packageName) {
	// i.e. ClientNext\node_modules
	var nodeModulesPath = path.resolve(basePath, "node_modules");
	// i.e. ClientNext\node_modules\owa-build
	var targetPackagePath = path.resolve(nodeModulesPath, packageName);
	
	// i.e. target\dev\owa\ClientNext\packages
	var packagesPath = path.resolve(targetBasePath, "packages");
	// i.e. target\dev\owa\ClientNext\packages\owa-build
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

function prepDeps(basePath) {
	console.log("Prepping deps, basedir: " + basePath);
	
	var packages = collectPackages("packages");
	
	packages.forEach(function(packageDir) {
		var packageName = path.basename(packageDir);
		
		console.log("cleaning up for " + packageName);
		cleanLinks(basePath, packageName);
	});
	
	packages.forEach(function(packageDir) {
		var packageName = path.basename(packageDir);
		
		console.log("npm linking for " + packageName);
		npmLink(basePath, packageName);
	});	
}

var baseDir = process.env["NODE_PATH"] ? path.resolve(process.env["NODE_PATH"], '..') : path.resolve(__dirname, '..');  

prepDeps(baseDir);

console.log("NOTE: all the node_modules in packages subdirectories are SYMLINKed from the main node_modules in the root directory of ClientNext")