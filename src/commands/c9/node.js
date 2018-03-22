const {Command, flags} = require('@oclif/command')
let C9Commands = require('../../utils/c9/index');
const colors = require('colors');

class NodeCommands extends Command {
  async run() {
    const {flags} = this.parse(NodeCommands)
    
    if(flags.upgrade) 
    {
      this.log(`Upgrading node to version 8...`.blue);
      C9Commands.execute('node-upgrade');
    }
  }
}

NodeCommands.description = 'Interact node.js';
NodeCommands.flags = {
 upgrade: flags.boolean({description: 'upgrade node to v8'}),
}
module.exports = NodeCommands
