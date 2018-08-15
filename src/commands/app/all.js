const {Command} = require('@oclif/command')
const Console = require('../../utils/console')
class All extends Command {
  async run() {
    Console.log(`Please specify one of the app. Help: $ breathecode app help`)
    // TODO: add new command for eslint
  }
}
All.description = 'Small apps to help developers'
module.exports = All
