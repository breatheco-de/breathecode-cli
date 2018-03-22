const {Command} = require('@oclif/command')
class All extends Command {
  async run() {
    this.warn(`Mmmm.. all? really? You want to do all at once? Help: $ breathecode c9 help`);
  }
}
All.description = 'Interact with Cloud9 functionalities';
module.exports = All
