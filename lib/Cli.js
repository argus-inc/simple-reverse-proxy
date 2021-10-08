#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const SimpleReverseProxy_1 = require("./SimpleReverseProxy");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const validators_1 = require("./validators");
// Definning consts
let jsonedConfig = undefined;
const cwd = process.cwd();
const config = path.join(cwd, 'srp.json');
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).options({
    config: { type: 'string' },
    /*b: { type: 'string', demandOption: true },
    c: { type: 'number', alias: 'chill' },
    d: { type: 'array' },
    e: { type: 'count' },
    f: { choices: ['1', '2', '3'] }*/
}).parseSync();
console.log(`Current running dir: ${cwd}`);
console.log(`Current config ${config}`);
if (argv.config) {
    const normalizedPath = path.normalize(argv.config);
    if (fs.existsSync(normalizedPath)) {
        jsonedConfig = JSON.parse(fs.readFileSync(normalizedPath).toString());
    }
}
else {
    const normalizedPath = path.normalize(config);
    if (fs.existsSync(normalizedPath)) {
        jsonedConfig = JSON.parse(fs.readFileSync(normalizedPath).toString());
    }
    else {
        console.log(`Could not load config from: ${config}`);
    }
}
if (jsonedConfig) {
    const isValidConfig = (0, validators_1.configValidator)(jsonedConfig);
    if (isValidConfig.valid) {
        // create Child Manager
        const simpleReverseProxyInstance = new SimpleReverseProxy_1.SimpleReverseProxy(jsonedConfig);
        console.log(`Ready to create reverse proxy`);
    }
    else {
        console.dir(jsonedConfig);
        console.log("\nThere was an error in your config file\n");
        console.log(isValidConfig.errors.join('\n'));
    }
}
