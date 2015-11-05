var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));

var kintsugi = new Liftoff({
	name: 'kintsugi'
});

kintsugi.on('require', function(name, module) {
	console.log('Loading external module:', name);
});

kintsugi.on('requireFail', function(name, err) {
	console.log('Unable to load:', name, err);
});

kintsugi.launch({}, function() {
	console.log("HI");
});