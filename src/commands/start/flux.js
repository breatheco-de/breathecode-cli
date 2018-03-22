const {Command} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')

class SingleCommand extends Command {
  async run() {
      this.log(`Creating React.js project...`.blue)
      BashScripts.installBoilerplate('flux')
  }
}

SingleCommand.description = 'Start a new React+Flux project'
module.exports = SingleCommand
