const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index');

class SingleCommand extends Command {
  async run() {
//    const {flags} = this.parse(ReactCommans)
    
      this.log(`Creating React.js project...`.blue);
      BashScripts.installBoilerplate('flux');
  }
}

SingleCommand.description = 'Start a new React+Flux project';
SingleCommand.flags = {
 //react: flags.boolean({description: 'start MySQL'}),
}
module.exports = SingleCommand
