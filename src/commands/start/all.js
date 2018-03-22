const {Command} = require('@oclif/command')
const Console = require('../../utils/console')
class All extends Command {
  async run() {
    Console.log(`Just chill little grasshopper, you can't do it all at once. Help: $ breathecode start help`)
  }
}
All.description = 'A collection of boilerplates to start new projects'
module.exports = All
