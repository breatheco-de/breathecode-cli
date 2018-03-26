const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    const {flags} = this.parse(SingleCommand)
    
      Console.info(`Creating WordPress project...`)
      BashScripts.installBoilerplate('wordpress', flags.root)
  }
}

SingleCommand.description = 'Start a new react project'
SingleCommand.flags = {
 root: flags.boolean({char:'r', description: 'install on the root directory'})
}
module.exports = SingleCommand
