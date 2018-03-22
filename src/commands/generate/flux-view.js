const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')

class FluxView extends Command {
  async run() {
    const {flags} = this.parse(FluxView)
    const name = flags.name || 'MyView'
    Console.info(`Generating Flux.View: ${name}...`)
    FluxCommands.createHierarchy()
    FluxCommands.generate('view',name)
  }
}

FluxView.description = 'Generate a new Flux.View'
FluxView.flags = {
 name: flags.string({char: 'n', description: 'the view name (optional)'})
}
module.exports = FluxView
