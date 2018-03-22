const {Command} = require('@oclif/command')
let Console = require('../utils/console')
class PrintCommand extends Command {
  async run() {
    Console.help(`breathecode generate help`)
    Console.done()
    Console.done('204')
    Console.error('It seems to be an error')
    Console.warning('Beware for the dogs')
    Console.info('You know nothing Jhon Snow')
    Console.success('This was a huge success')
    Console.log('Randome command executed')
    Console.toCopy('$ npm run start')
    Console.toCopy('$ npm run ***start***')
  }
}
PrintCommand.description = 'For testing purposes'
PrintCommand.hidden = true
module.exports = PrintCommand