const {Command} = require('@oclif/command')
class All extends Command {
  async run() {
    this.warn(`Dude, you need to specify what to generate! Need Help? $ breathecode generate help`);
  }
}
All.description = 'Generate template code and other boring stuff!';
module.exports = All
