const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')
class FluxFolders extends Command {
  async run() {
    const {flags} = this.parse(FluxFolders)
    Console.info(`Generating flux folders: ...`)
    FluxCommands.createHierarchy()
    if (flags.withSamples)
    {
      FluxCommands.generate('store')
      FluxCommands.generate('action')
      FluxCommands.generate('view')
      FluxCommands.generate('component')
    }
  }
}
FluxFolders.description = 'Generate Flux standard directories'
FluxFolders.flags = {
 withSamples: flags.boolean({char: 'w', description: 'include a sample Action, View and Store'})
}
module.exports = FluxFolders
