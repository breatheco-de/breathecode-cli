const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    Console.error(`Please specify if you want to start a react-project or react-exercise`);
    Console.help(`For example: $ bc start:react-project`);
  }
}
SingleCommand.description = 'Start a new react project or exercise';
SingleCommand.flags = {
}
module.exports = SingleCommand
