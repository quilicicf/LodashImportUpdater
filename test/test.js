const {readFileSync} = require('fs')
const jscodeshift = require('jscodeshift')
const {resolve: resolvePath} = require('path')

const script = require('..')

const path = resolvePath(__dirname, 'input.js')
const source = readFileSync(path, 'utf8')

const newSource = script({source, path}, {jscodeshift})
process.stdout.write(`${newSource}\n`)
