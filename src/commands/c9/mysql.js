const {Command, flags} = require('@oclif/command')
let C9Commands = require('../../utils/c9/index');
const colors = require('colors');

class MysqlCommand extends Command {
  async run() {
    const {flags} = this.parse(MysqlCommand)
    
    if(flags.start) 
    {
      this.log(`Trying to start mysql...`.blue);
      C9Commands.execute('mysql-start');
    }
    if(flags.stop) 
    {
      this.log(`Trying to stop mysql...`.blue);
      C9Commands.execute('mysql-stop');
    }
    if(flags.install){
      this.log(`Trying to install mysql...`.blue);
      C9Commands.execute('mysql-install');
    }
  }
}

MysqlCommand.description = 'Interact with MySQL';
MysqlCommand.flags = {
 start: flags.boolean({description: 'start MySQL'}),
 stop: flags.boolean({description: 'stop MySQL'}),
 install: flags.boolean({description: 'install MySQL'}),
}
module.exports = MysqlCommand
