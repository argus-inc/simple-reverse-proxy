#!/usr/bin/env node
import yargs, { Argv, command } from 'yargs'
import { hideBin } from 'yargs/helpers'
import { SimpleReverseProxy } from './SimpleReverseProxy';
import * as path from 'path'
import * as fs from 'fs'
import { configValidator } from './validators'
// Definning consts
let jsonedConfig: undefined | any = undefined
const cwd = process.cwd()
const config = path.join(cwd, 'srp.json')

const argv = yargs(hideBin(process.argv)).options({
    config: { type: 'string' },
    /*b: { type: 'string', demandOption: true },
    c: { type: 'number', alias: 'chill' },
    d: { type: 'array' },
    e: { type: 'count' },
    f: { choices: ['1', '2', '3'] }*/
}).parseSync();

console.log(`Current running dir: ${cwd}`)
console.log(`Current config ${config}`)
if (argv.config) {
    const normalizedPath = path.normalize(argv.config)
    if (fs.existsSync(normalizedPath)) {
        jsonedConfig = JSON.parse(fs.readFileSync(normalizedPath).toString())
    }
} else {
    const normalizedPath = path.normalize(config)
    if (fs.existsSync(normalizedPath)) {
        jsonedConfig = JSON.parse(fs.readFileSync(normalizedPath).toString())
    } else {
        console.log(`Could not load config from: ${config}`)
    }
}

if (jsonedConfig) {
    const isValidConfig = configValidator(jsonedConfig)
    if (isValidConfig.valid) {
        // create Child Manager
        const simpleReverseProxyInstance = new SimpleReverseProxy(jsonedConfig)
        console.log(`Ready to create reverse proxy`)
    } else {
        console.dir(jsonedConfig)
        console.log("\nThere was an error in your config file\n")
        console.log(isValidConfig.errors.join('\n'))
    }
}