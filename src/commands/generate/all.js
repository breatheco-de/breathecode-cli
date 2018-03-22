const {Command} = require('@oclif/command')
let Console = require('../../utils/console')
class All extends Command {
  async run() {
    Console.log(`Dude, you need to specify what to generate! Need Help? $ breathecode generate help`)
  }
}
All.description = 'Generate template code and other boring stuff!'
module.exports = All
