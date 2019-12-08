const {execSync} = require('child_process')
const glob = require('glob')

const match = process.argv[2] || ''
// all folders
// let globPattern = `!(node_modules)/**/*${match}*{,/**/*}.test.js`
// lib folder only
let globPattern = `!(node_modules)lib/**/*${match}*{,/**/*}.test.js`

// if searching for .test.js, remove extra .test.js
if (match.match(/\.test\.js$/)) {
  globPattern = globPattern.replace(/\.test\.js$/, '')
}

const tests = glob.sync(globPattern)
console.log(`${globPattern} matched ${tests.length}: `)
console.log(tests)

const command =
  `npm run lint `
  + `&& npm run tape -- "${globPattern}" `
  + `| npm run tap-spec`

execSync(command, {stdio: 'inherit'})
