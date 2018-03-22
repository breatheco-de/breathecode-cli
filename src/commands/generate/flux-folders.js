const {Command} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')
class FluxFolders extends Command {
  async run() {
    Console.info(`Generating flux folders: ...`)
    FluxCommands.createHierarchy()
  }
}
FluxFolders.description = 'Generate flux directory hierarchy'
module.exports = FluxFolders
