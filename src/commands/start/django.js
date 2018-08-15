const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    Console.error(`Please specify if you want to start a django-project or django-exercise`);
    Console.help(`For example: $ bc start:django-project`);
  }
}
SingleCommand.description = 'Start a new django project or exercise';
SingleCommand.flags = {
}
module.exports = SingleCommand
