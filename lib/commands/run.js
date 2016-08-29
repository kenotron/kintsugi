"use strict";
var server_1 = require('../server');
var webpackDevMiddlware = require('webpack-dev-middleware');
var webpack = require('webpack');
function run(argv) {
    server_1.default.use(webpackDevMiddlware(webpack({})));
    server_1.default.listen(300, function () {
        console.log("Dev server started at: http://localhost:3000");
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
