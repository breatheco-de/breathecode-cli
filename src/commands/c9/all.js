const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class All extends Command {
  async run() {
    Console.info('Mmmm.. all? really? You want to do all at once?')
    Console.toCopy('$ breathecode c9 help')
  }
}
All.description = 'Interact with Cloud9 functionalities'
module.exports = All
