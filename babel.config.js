const fs = require('fs')

let environment
if (process.env.ENV)
  environment = process.env.ENV.trim()
else
  environment = 'dev'
console.log(`Environment: ${environment}`)

console.log('Reading config from ./env.json')
const config = require('./env.json')
loadConfig(config, `./env.${environment}.json`)

console.log('Build configuration')
console.log(config)

let version = require('./package.json').version
if (environment !== 'prod')
  version = `${version}/${environment}`
console.log(`App version: ${version}`)

const replacements = [
  replacement('config', 'version', version),
  replacement('config', 'environment', environment),
  replacement('config', 'serverUrl', config.serverUrl),
  replacement('config', 'apiVersion', config.apiVersion),
  replacement('config', 'googleFitSyncInterval', config.googleFitSyncInterval),
]

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['minify-replace', { replacements }],
  ],
}

function replacement(identifierName, member, value) {
  let replacement
  if (typeof value === 'string') replacement = { type: 'stringLiteral', value }
  else if (typeof value === 'number') replacement = { type: 'numericLiteral', value }
  else if (typeof value === 'boolean') replacement = { type: 'booleanLiteral', value }
  else if (!value) replacement = { type: 'stringLiteral', value: '' }
  return { identifierName, member, replacement }
}

function loadConfig(config, path) {
  if (fs.existsSync(path)) {
    const patch = require(path)
    merge(config, patch)
    console.log(`Merging configuration from ${path}`)
  } else
    console.log(`Configuration merging skipped as ${path} can't be found`)
}

function merge(target, patch) {
  for (const key in patch)
    if (patch.hasOwnProperty(key)) {
      if (typeof patch[key] === 'object') {
        if (!target[key])
          target[key] = {}
        merge(target[key], patch[key])
      }
      else
        target[key] = patch[key]
    }
}
