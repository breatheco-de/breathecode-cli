const {Command, flags} = require('@oclif/command')
let C9Commands = require('../../utils/c9/index')
let Console = require('../../utils/console')

class MysqlCommand extends Command {
  async run() {
    const {flags} = this.parse(MysqlCommand)
    
    if (flags.start) 
    {
      Console.info('Trying to ***start*** MySQL...')
      C9Commands.execute('mysql-start')
    }
    if (flags.stop) 
    {
      Console.info('Trying to ***stop*** MySQL...')
      C9Commands.execute('mysql-stop')
    }
    if (flags.install){
      Console.info(`Trying to ***install*** mysql...`.blue)
      C9Commands.execute('mysql-install')
    }
  }
}

MysqlCommand.description = 'Interact with MySQL'
MysqlCommand.flags = {
 start: flags.boolean({description: 'start MySQL'}),
 stop: flags.boolean({description: 'stop MySQL'}),
 install: flags.boolean({description: 'install MySQL'})
}
module.exports = MysqlCommand
