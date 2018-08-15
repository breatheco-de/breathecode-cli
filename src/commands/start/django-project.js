const {Command} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
      Console.info(`Creating Django-Rest project...`)
      BashScripts.installBoilerplate('django-rest')
  }
}

SingleCommand.description = 'Start a new Django+REST project'
module.exports = SingleCommand
