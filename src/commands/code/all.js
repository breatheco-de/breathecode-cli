const {Command} = require('@oclif/command')
const Console = require('../../utils/console')
class All extends Command {
  async run() {
    Console.log(`You cannot analyze all at once, pleas specify one of the options. Help: $ breathecode code help`)
    // TODO: add new command for eslint
  }
}
All.description = 'Analyze your code for best practices and find TODOs'
module.exports = All
