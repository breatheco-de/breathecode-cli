var shell = require('shelljs')
var Console = require('../../console')

let args = {}
process.argv.forEach(function (val, index, array) {
  if (val.indexOf('--') !== -1){
    if (array[index+1].indexOf('--') === -1) args[val] = array[index+1]
    else args[val] = true
  } 
})
if (typeof args['--type'] === 'undefined') args['--type'] = 'js'
 
if (!shell.which('leasot')) {
  Console.error('Sorry, this script requires leasot')
  Console.help('Install the leasot library by doing the following:')
  Console.toCopy('$ npm i leasot --save-dev')
  shell.exit(1)
}

Console.info(`Looking for ***${args['--type']}*** files...`)
process.setMaxListeners(0)
let numberOfOpenProcesses = 0, numberOfFiles = 0
shell.find('src/').filter(function(file) { 
  return (file.indexOf(`.${args['--type']}`) !== -1)
}).forEach(function (file) {
  numberOfOpenProcesses++
  
  if (args['--log']) Console.log(`Analysing ${file}`)
  
  let child = shell.exec(`leasot ${file}`, {async:true, silent: true})
  child.stdout.on('data', function(data) {
    numberOfFiles++
    if (data.indexOf('No todos/fixmes found') === -1) Console.todo(data)
  })
  child.stdout.on('error', function(error) {
    numberOfOpenProcesses--
    Console.error(error)
    if (numberOfOpenProcesses===0) Console.done()
  })
  child.stdout.on('close', function() {
    numberOfOpenProcesses--
    if (numberOfOpenProcesses===0) Console.done(`***${numberOfFiles}*** files found and analized`)
  })
})
