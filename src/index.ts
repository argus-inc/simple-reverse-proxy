import { Proxit } from './server';
import path from 'path'
import fs from 'fs'
import { configValidator } from './validators'
let jsonedConfig: undefined | any = undefined
const cwd = process.cwd()
const config = path.join(cwd, 'srp.json')
console.log(`Current running dir: ${cwd}`)
console.log(`Current config ${config}`)
if (fs.existsSync(config)) {
    console.log(`Founf config. Parsing...`)
    jsonedConfig = JSON.parse(fs.readFileSync(config).toString())
} else {
    console.log(`Config should be at: ${config}`)
    //return false
}

if (jsonedConfig) {
    const isValidConfig = configValidator(jsonedConfig)
    if (isValidConfig.valid) {
        // create Child Manager
        const proxitInstance = new Proxit(jsonedConfig)
        console.log(`Ready to create reverse proxy`)
    } else {
        console.dir(jsonedConfig)
        console.log("\nThere was an error in your config file\n")
        console.log(isValidConfig.errors.join('\n'))
    }
}