const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    const {flags} = this.parse(SingleCommand)
    
    Console.info(`Creating React.js project...`)
    BashScripts.installBoilerplate('flux', flags.root)
  }
}

SingleCommand.description = 'Start a new React+Flux project'
SingleCommand.flags = {
 root: flags.boolean({char:'r', description: 'install on the root directory'})
}
module.exports = SingleCommand
