const {Command, flags} = require('@oclif/command')
let FluxCommands = require('../../utils/generator/flux/index')
let Console = require('../../utils/console')

class ReactComponent extends Command {
  async run() {
    const {flags} = this.parse(ReactComponent)
    const name = flags.name || 'MyComponent'
    Console.info(`Generating the React.Component: ${name}...`)
    FluxCommands.createHierarchy()
    FluxCommands.generate('component',name)
  }
}

ReactComponent.description = 'Generate a new React.Component'
ReactComponent.flags = {
 name: flags.string({char: 'n', description: 'the component name (optional)'})
}
module.exports = ReactComponent
