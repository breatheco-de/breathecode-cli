const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index');

class SingleCommand extends Command {
  async run() {
//    const {flags} = this.parse(SingleCommand)
    
      this.log(`Creating React.js project...`.blue);
      BashScripts.installBoilerplate('react');
  }
}

SingleCommand.description = 'Start a new react project';
SingleCommand.flags = {
 //react: flags.boolean({description: 'start MySQL'}),
}
module.exports = SingleCommand
