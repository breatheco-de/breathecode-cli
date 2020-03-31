const {Command, flags} = require('@oclif/command');
let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
const prompts = require('prompts');

const path = require('path');
const fs = require('fs');

class SingleCommand extends Command {
  async run() {
      const { flags } = this.parse(SingleCommand);

  }
}

// SingleCommand.aliases = ['start:exercises'];
SingleCommand.description = 'Publish project to the registry'
SingleCommand.flags = {
//  technology: flags.string({char:'t', description: 'technology, e.g: [dom,html,css,react,python-lists,python-beginner,etc].', default: null }),
}
module.exports = SingleCommand
