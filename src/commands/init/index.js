const {Command, flags} = require('@oclif/command');
const fs = require('fs');
const prompts = require('prompts');

let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
let _defaults = require('../../utils/config/compiler/_defaults.js');

let extensions = {
  html: "js",
  vanillajs: "js",
  react: "js",
  node: "js",
  python3: "py",
  java: "java",
};

const path = require('path');
class StartExercisesComand extends Command {
  async run() {

      let { language, grading } = this.parse(StartExercisesComand);

      let choices = {};
      if(!language){
          choices= await prompts([{
              type: 'select',
              name: 'language',
              message: 'Pick a language',
              choices: [
                { title: 'HTML', value: 'html' },
                { title: 'CSS', value: 'css' },
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
            },{
              type: 'text',
              name: 'title',
              initial: 'My Interactive Tutorial',
              message: 'Title for your tutorial? Press enter to leave as it is'
            },{
              type: 'text',
              name: 'description',
              initial: '',
              message: 'Description for your tutorial? Press enter to leave blank'
            },{
              type: 'select',
              name: 'difficulty',
              message: 'How difficulty will be to complete the tutorial?',
              choices: [
                { title: 'Begginer (no previous experience)', value: 'beginner' },
                { title: 'Easy (just a bit of experience required)', value: 'easy' },
                { title: 'Intermediate (you need experience)', value: 'intermediate' },
                { title: 'Hard (master the topic)', value: 'hard' },
              ],
            },{
              type: 'text',
              name: 'duration',
              initial: "1",
              message: 'How many hours avg it takes to complete (number)?',
              validate: value => {
                var n = Math.floor(Number(value));
                return n !== Infinity && String(n) === value && n >= 0;
              }
            }
            ]);
        grading = choices.grading;
        language = choices.language;
      }

      const config = Object.assign(_defaults[language]);
      config.grading = grading;
      config.difficulty = choices.difficulty;
      config.duration = parseInt(choices.duration);
      config.description = choices.description;
      config.title = choices.title;
      config.slug = choices.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
      Console.info(`Creating exercises boilerplate...`);

      const builderPath = path.resolve(__dirname,`../../utils/config/compiler/${config.compiler}.js`);
      if (!fs.existsSync(builderPath)){
        Console.error(`Uknown compiler: ${config.compiler} for language ${flags.language}`);
        return;
      }

      fs.readdir('./', function(err, files) {
          files = files.filter(f => f !== '.node-persist' || f !== '.git');
          if (err) {
            Console.error(err.message);
          } else {
            if (!files.length) {
                fs.writeFileSync('./bc.json', JSON.stringify(config, null, 2));

                fs.writeFileSync('./.gitignore', fs.readFileSync(path.resolve(__dirname,`./_templates/gitignore.${grading}.txt`)));

                let basePath = "";
                if (grading == "incremental") basePath = ".breathecode/";

                if(!fs.existsSync(`./${basePath}exercises`)){
                    if(basePath != '' && !fs.existsSync(`./${basePath}`)) fs.mkdirSync(`./${basePath}`);
                    fs.mkdirSync(`./${basePath}exercises`);
                    fs.mkdirSync(`./${basePath}exercises/01-introduction`);
                    fs.writeFileSync(`./${basePath}exercises/01-introduction/README.md`, fs.readFileSync(path.resolve(__dirname,`./_templates/INTRO.md`)));
                    fs.mkdirSync(`./${basePath}exercises/01-hello-world`);
                    fs.writeFileSync(`./${basePath}exercises/02-hello-world/README.md`, fs.readFileSync(path.resolve(__dirname,`./_templates/README.md`)));
                    fs.writeFileSync(`./${basePath}exercises/02-hello-world/test.${extensions[language]}`, fs.readFileSync(path.resolve(__dirname,`./_templates/test.${language}.${extensions[language]}`)));
                    fs.writeFileSync(`./${basePath}exercises/02-hello-world/app.${extensions[language]}`, fs.readFileSync(path.resolve(__dirname,`./_templates/app.${extensions[language]}`)));
                }

                Console.success(`😋 Exercises boilerplate created successfully`);

                return true;
              }
              else Console.error(`The directory must be empty in order to start creating the exercises: ${files.join(',')}`);

              return false;
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
