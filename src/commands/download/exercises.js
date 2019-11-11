const {Command, flags} = require('@oclif/command');
let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
const prompts = require('prompts');

const path = require('path');
const fs = require('fs');

class SingleCommand extends Command {
  async run() {
      const { flags } = this.parse(SingleCommand);

      const catalogJson = fs.readFileSync(path.resolve(__dirname,`./exercises.json`));
      const catalog = JSON.parse(catalogJson);

      if(!flags.technology){
        Console.error(`Please specify the main technology for the exercises you want to download`);
        let langChoice = await prompts([{
            type: 'select',
            name: 'technology',
            message: 'Pick a technology:',
            choices: [...new Set(catalog.map(c => ({ title: c.language, value: c.language })))],
          }]);
        flags.technology = langChoice.technology;
      }

      let exerciseChoice = await prompts([{
          type: 'select',
          name: 'slug',
          message: 'Pick a exercises',
          choices: catalog.filter(c => c.language === flags.technology).map(c => ({ title: c.title, value: c.slug })),
        }]);

      if(exerciseChoice.slug)
      {
        Console.info(`Creating new exercises: ${exerciseChoice.slug}...`);
        const result = catalog.find(c => c.slug === exerciseChoice.slug);
        BashScripts.downloadAndInstall(result);
      }
  }
}

SingleCommand.aliases = ['start:exercises'];
SingleCommand.description = 'Start a new project using a boilerplate'
SingleCommand.flags = {
 technology: flags.string({char:'t', description: 'technology, e.g: [dom,html,css,react,python-lists,python-beginner,etc].', default: null }),
 root: flags.boolean({char:'r', description: 'install on the root directory'}),
 mode: flags.string({char:'m', description: 'install a particular branch or version for the boilerplate'}),
 name: flags.string({char:'n', description: 'app folder name', default: 'hello-rigo'})
}
module.exports = SingleCommand
