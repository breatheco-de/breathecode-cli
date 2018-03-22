const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index');

class FluxFolders extends Command {
  async run() {
    this.log(`Generating flux folders: ...`);
    FluxCommands.createHierarchy();
  }
}
FluxFolders.description = 'Generate flux directory hierarchy';
module.exports = FluxFolders
