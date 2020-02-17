const {Command, flags} = require('@oclif/command');
const fs = require('fs');
const prompts = require('prompts');

let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
let _defaults = require('../../utils/config/compiler/_defaults.js');

const path = require('path');
class StartExercisesComand extends Command {
  async run() {

      let { language, grading } = this.parse(StartExercisesComand);

      if(!language){
        let choices = await prompts([{
              type: 'select',
              name: 'language',
              message: 'Pick a language',
              choices: [
                { title: 'HTML', value: 'html' },
                { title: 'HTML/CSS/JS (vanillajs)', value: 'vanillajs' },
                { title: 'React.js', value: 'react' },
                { title: 'Node.js', value: 'node' },
                { title: 'Python 3.7', value: 'python3' },
                { title: 'Java', value: 'java' }
              ],
            },{
              type: 'select',
              name: 'grading',
              message: 'Is the auto-grading going to be isolated or incremental?',
              choices: [
                { title: 'Incremental: Build on top of each other like a tutorial', value: 'incremental' },
                { title: 'Isolated: Small separated exercises', value: 'isolated' },
              ],
            }
            ]);
        grading = choices.grading;
        language = choices.language;
      }

      const config = Object.assign(_defaults[language]);
      config.grading = grading;
      Console.info(`Creating exercises boilerplate...`);

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
                fs.writeFileSync('./bc.json', JSON.stringify(config, null, 2));

                fs.writeFileSync('./.gitignore', fs.readFileSync(path.resolve(__dirname,`./gitignore.${grading}.txt`)));

                let basePath = "";
                if (grading == "incremental") basePath = ".breathecode/";

                if(!fs.existsSync(`./${basePath}exercises`)){
                    if(basePath != '' && !fs.existsSync(`./${basePath}`)) fs.mkdirSync(`./${basePath}`);
                    fs.mkdirSync(`./${basePath}exercises`);
                    fs.mkdirSync(`./${basePath}exercises/01-hello-world`);
                    fs.writeFileSync(`./${basePath}exercises/01-hello-world/README.md`, "# Hello World \n \n Type here your exercise instructions");
                }

                Console.success(`😋 Exercises boilerplate created successfully`);
            }
            else Console.error(`The directory must be empty in order to start creating the exercises: ${files.join(',')}`);
          }
      });
  }
}

StartExercisesComand.description = 'Create new exercises or tutorials'
StartExercisesComand.flags = {
 language: flags.string({char:'l', description: 'specify what language you want: [html, css, react, vanilajs, node, python]'}),
 grading: flags.string({char:'g', description: 'Grading type for exercises: [isolated, incremental]'}),
}
module.exports = StartExercisesComand
