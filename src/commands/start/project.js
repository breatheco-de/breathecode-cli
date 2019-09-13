const {Command, flags} = require('@oclif/command');
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
      const { flags } = this.parse(SingleCommand)

      if(!flags.technology){
        Console.error(`Please specify the main technology for the project you want to start`);
        Console.help(`For example: $ bc start:project -t=react`);
      }
      else{
        Console.info(`Creating new ${flags.technology} project...`)
        BashScripts.installBoilerplate('django-rest')
      }
  }
}

SingleCommand.description = 'Start a new project using a boilerplate'
SingleCommand.flags = {
 technology: flags.string({char:'t', description: 'technology, e.g: [flask,django,react,flux,vanillajs,wordpress,etc].', default: null }),
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
 mode: flags.string({char:'m', description: 'install a particular branch or version for the boilerplate'}),
 name: flags.string({char:'n', description: 'app folder name', default: 'hello-rigo'})
}
module.exports = SingleCommand
