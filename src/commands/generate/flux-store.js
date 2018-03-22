const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')
class FluxStore extends Command {
  async run() {
    const {flags} = this.parse(FluxStore)
    const name = flags.name || 'MyStore'
    Console.log(`Generating flux store: ${name}...`)
    FluxCommands.createHierarchy()
    FluxCommands.generate('store',name)
  }
}

FluxStore.description = 'Generate a new flux store'
FluxStore.flags = {
 name: flags.string({char: 'n', description: 'the store name (optional)'})
}
module.exports = FluxStore
