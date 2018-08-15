const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    Console.error(`Please specify if you want to start a wordpress-project or wordpress-exercise`);
    Console.help(`For example: $ bc start:wordpress-project`);
  }
}
SingleCommand.description = 'Start a new wordpress project or exercise';
SingleCommand.flags = {
}
module.exports = SingleCommand
