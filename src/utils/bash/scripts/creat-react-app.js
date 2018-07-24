var shell = require('shelljs')
const { exec } = require('child_process')
var Console = require('../../console')
 //Console.info(`Looking for ***${args['--type']}*** files...`)

let args = {}
process.argv.forEach(function (val, index, array) {
  if (val.indexOf('--') !== -1){
    if (array[index+1].indexOf('--') === -1) args[val] = array[index+1]
    else args[val] = true
  } 
})

if (typeof args['--name'] === 'undefined'){
  Console.error(`You need to specify your app name using the flag: --name=<your_app_name>`)
  shell.exit(1)
}
 
if (!shell.which('git') || !shell.which('npm')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

if (shell.exec('npx create-react-app '+args['--name']+' -y').code == 0) {
  Console.success(`React was successfully installed...`)
  shell.exit(0)
}
else{
  Console.error(`There was an error installing React using create-react-app`);
  shell.exit(1)
}

