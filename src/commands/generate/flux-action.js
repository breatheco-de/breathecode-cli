const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')

class FluxAction extends Command {
  async run() {
    const {flags} = this.parse(FluxAction)
    const name = flags.name || 'MyActions'
    Console.info(`Generating Flux.Action: ${name}...`)
    FluxCommands.createHierarchy()
    FluxCommands.generate('action',name)
  }
}

FluxAction.description = 'Generate a new Flux.Action'
FluxAction.flags = {
 name: flags.string({char: 'n', description: 'the action name (optional)'})
}
module.exports = FluxAction
