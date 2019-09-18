const {Command, flags} = require('@oclif/command');
var fs = require('fs');
let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
let _defaults = require('../../utils/config/compiler/_defaults.js');

const path = require('path');
class StartExercisesComand extends Command {
  async run() {

      const { language } = this.parse(StartExercisesComand);
      const config = Object.assign(_defaults[language]);
      Console.info(`Creating exercises boilerplate...`);

      if(!flags.language){
        Console.error(`Please specify a compiler using the -l flag: $ bc start:exercises -l=<react|javascript|html|vanillajs>`);
        return;
      }

      const builderPath = path.resolve(__dirname,`../../utils/config/compiler/${config.compiler}.js`);
      if (!fs.existsSync(builderPath)){
        Console.error(`Uknown compiler: ${config.compiler} for language ${flags.language}`);
        return;
      }

      fs.readdir('./', function(err, files) {
          files = files.filter(f => f !== '.node-persist');
          if (err) {
            Console.error(err.message);
          } else {
            if (!files.length) {
                fs.writeFileSync('./bc.json', JSON.stringify({
                  compiler: config.compiler
                }, null, 2));

                fs.writeFileSync('./.gitignore', fs.readFileSync(path.resolve(__dirname,'./gitignore.txt')));

                if (!fs.existsSync('./exercises')){
                    fs.mkdirSync('./exercises');
                }

                if (!fs.existsSync('./exercises/01-hello-world')){
                    fs.mkdirSync('./exercises/01-hello-world');
                }

                fs.writeFileSync('./exercises/01-hello-world/README.md', "# Hello World \n \n Type here your exercise instructions");
            }
            else Console.error(`The directory must be empty in order to start creating the exercises: ${files.join(',')}`);
          }
      });
  }
}

StartExercisesComand.description = 'Initialize the boilerplate for creating exercises'
StartExercisesComand.flags = {
 language: flags.string({char:'l', description: 'specify what language you want: [html, css, react, vanilajs, node, python]'}),
}
module.exports = StartExercisesComand
