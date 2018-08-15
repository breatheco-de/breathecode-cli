const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    Console.error(`Please specify if you want to start a flux-project or flux-exercise`);
    Console.help(`For example: $ bc start:flux-project`);
  }
}
SingleCommand.description = 'Start a new flux project or exercise';
SingleCommand.flags = {
}
module.exports = SingleCommand
