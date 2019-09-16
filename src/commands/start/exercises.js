const {Command, flags} = require('@oclif/command');
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
      const { flags } = this.parse(SingleCommand)

      if(!flags.technology){
        Console.error(`Please specify the main technology for the exercises you want to start`);
        Console.help(`For example: $ bc start:exercises -t=react`);
      }
      else{
        Console.info(`Creating new ${flags.technology} project...`);
        BashScripts.downloadAndInstall('exercises',flags.technology);
      }
  }
}

SingleCommand.description = 'Start a new project using a boilerplate'
SingleCommand.flags = {
 technology: flags.string({char:'t', description: 'technology, e.g: [dom,html,css,react,python-lists,python-beginner,etc].', default: null }),
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
 mode: flags.string({char:'m', description: 'install a particular branch or version for the boilerplate'}),
 name: flags.string({char:'n', description: 'app folder name', default: 'hello-rigo'})
}
module.exports = SingleCommand
