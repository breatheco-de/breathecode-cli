const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index');

class SingleCommand extends Command {
  async run() {
    const {flags} = this.parse(SingleCommand)
    
      this.log(`Creating React.js project...`.blue);
      let response = BashScripts.installBoilerplate('react', flags.root);
  }
}

SingleCommand.description = 'Start a new react project';
SingleCommand.flags = {
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
}
module.exports = SingleCommand
