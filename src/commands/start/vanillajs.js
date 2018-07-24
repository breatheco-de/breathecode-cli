const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    const {flags} = this.parse(SingleCommand)
    
      Console.info(`Creating Vanilla.js project...`)
      BashScripts.installBoilerplate('vanillajs', flags)
  }
}

SingleCommand.description = 'Start a new Vanilla.js project'
SingleCommand.flags = {
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
 branch: flags.string({char:'b', description: 'install a particular branch or version'}),
 name: flags.string({char:'n', description: 'app name', default: 'hello-rigo'})
}
module.exports = SingleCommand
