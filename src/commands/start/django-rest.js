const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index');

class SingleCommand extends Command {
  async run() {
//    const {flags} = this.parse(ReactCommans)
    
      this.log(`Creating Django-Rest project...`.blue);
      BashScripts.installBoilerplate('django-rest');
  }
}

SingleCommand.description = 'Start a new Django+REST project';
SingleCommand.flags = {
 //react: flags.boolean({description: 'start MySQL'}),
}
module.exports = SingleCommand
