const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const fs = require('fs')
const path = require('path')

chai.use(chaiAsPromised)

const normalizedPath = path.join(__dirname, '../src')
const requireJavascriptFile = (file) => !file.includes('.test.js') && require(`../src/${file}`)

fs.readdirSync(normalizedPath).forEach(requireJavascriptFile)
