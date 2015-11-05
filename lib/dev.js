//******************************************************************************
//* Fires Up the Gulp & Dev Server
//******************************************************************************
var WebpackDevServer = require("webpack-dev-server"),
	webpack			 = require("webpack"),
    webpackConfig    = require('../webpack.dev.config'),
	fs               = require('fs'),
	path             = require('path'),
	argv             = require('minimist')(process.argv.slice(2)),
	collectPackages  = require('./packages').collectPackages,
	spawn            = require('child_process').spawn;

// Globals
var packagesPath = "packages";

function startWebpackDevServer() {
	var chunks = [];
	var compilationLastSuccess = true;
	var doneInstalled = false;
	
	var compiler = webpack(webpackConfig, function(err, stats) {
		reportErrors(stats);
	});
	
	var server = new WebpackDevServer(compiler, {
		port: 3000,
		hot: true,
		inline: true,
		quiet: true
	});
	
	compiler.plugin("compilation", function(compilation) {
		if (!doneInstalled) {
			compiler.plugin("done", reportErrors);
			doneInstalled = true;
		}	
	});
	
	server.app.get("/entries", function(req, res) {
		var entries = [];
		
		chunks.forEach(function(chunk) {
			entries = entries.concat(chunk.files);
		});
		
		res.send(entries);
	});
	
	server.listen(3000, "localhost");
	
	function logChangedFile(file) {
		console.log("Detected change in: " + file.path);
	}
	
	function reportErrors(stats) {
		if (stats.hasErrors()) {
			console.log("---- This compile has errors ----");
			var errors = stats.compilation.errors;
		
			for (var i = 0; i < errors.length; i++)
			{
				var filename = errors[i].module ? errors[i].module.resource : errors[i].file;
				console.error(filename);
				console.error(errors[i].message);
			}
			compilationLastSuccess = false;
			
			stats.compilation.errors = [];
		} else {
			if (!compilationLastSuccess) {
				console.log("---- Good again ----");
			}
			compilationLastSuccess = true;
		}
		
		chunks = stats.toJson({chunks: true}).chunks;
	}
}	

function startGulp() {
	var buildPackages = null;
	var depth = 0;
	
	if (argv["_"].length > 0) {
		buildPackages = argv["_"]
	}
	
	if (argv["d"] || argv["depth"]) {
		depth = parseInt(argv["d"] || argv["depth"]);
	}
	
	var packageList = collectPackages(packagesPath, buildPackages, depth);
			
	packageList.forEach(p => {
		console.log(`gulp in ${path.resolve(packagesPath, p)}`);
		
		var cp = spawn(`gulp.cmd`, [], {cwd: path.resolve(packagesPath, p), stdio: 'pipe'});
		
		if (cp) {
			console.log(`gulping ${p}`);
		
			cp.stdout.on("data", d => {
				console.log(`[${p}] ${d}`);
			});
			
			cp.stderr.on("data", d => {
				console.error(`[${p}] ${d}`);
			});
		}
	});
}

startGulp();
startWebpackDevServer();