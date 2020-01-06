const {Command, flags} = require('@oclif/command');
const fs = require("fs");
const path = require("path");
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console');
const prompts = require('prompts');

class SingleCommand extends Command {
  async run() {
      const { flags } = this.parse(SingleCommand)

      const catalogJson = fs.readFileSync(path.resolve(__dirname,`./projects.json`));
      const catalog = JSON.parse(catalogJson);

      if(!flags.technology){
        Console.error(`Please specify the project technology for you want to download`);
        let choice = await prompts([{
            type: 'select',
            name: 'technology',
            message: 'Pick a project technology:',
            choices: [...new Set(catalog.map(c => ({ title: c.technology, value: c.technology })))],
          }]);
        flags.technology = choice.technology;
      }

      if(flags.technology){
        Console.info(`Creating new ${flags.technology} project...`);
        const result = catalog.find(c => c.technology === flags.technology);
        BashScripts.downloadAndInstall(result);
      }
  }
}

SingleCommand.aliases = ['start:project'];
SingleCommand.description = 'Start a new project using a boilerplate'
SingleCommand.flags = {
 technology: flags.string({char:'t', description: 'technology, e.g: [flask,django,react,flux,vanillajs,wordpress,etc].', default: null }),
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
 mode: flags.string({char:'m', description: 'install a particular branch or version for the boilerplate'}),
 name: flags.string({char:'n', description: 'app folder name', default: 'hello-rigo'})
}
module.exports = SingleCommand
