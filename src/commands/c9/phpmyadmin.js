const {Command, flags} = require('@oclif/command')
let C9Commands = require('../../utils/c9/index')
const Console = require('../../utils/console')

class PHPMyAdminCommands extends Command {
  async run() {
    const {flags} = this.parse(PHPMyAdminCommands)
    
    if (flags.install){
      Console.info(`Trying to install PhpMyAdmin...`)
      C9Commands.execute('phpmyadmin-install')
    }
  }
}

PHPMyAdminCommands.description = 'Interact with PhpMyAdmin'
PHPMyAdminCommands.flags = {
 install: flags.boolean({description: 'install phpmyadmin'})
}
module.exports = PHPMyAdminCommands
