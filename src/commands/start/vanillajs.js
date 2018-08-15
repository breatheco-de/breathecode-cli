const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    Console.error(`Please specify if you want to start a vanillajs-project or vanillajs-exercise`);
    Console.help(`For example: $ bc start:vanillajs-project`);
  }
}
SingleCommand.description = 'Start a new vanillajs project or exercise';
SingleCommand.flags = {
}
module.exports = SingleCommand
