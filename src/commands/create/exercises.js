const {Command, flags} = require('@oclif/command');
var fs = require('fs');
let BashScripts = require('../../utils/bash/index');
let Console = require('../../utils/console');
const path = require('path');
class StartExercisesComand extends Command {
  async run() {

      const { flags } = this.parse(StartExercisesComand);
      Console.info(`Creating exercises boilerplate...`);

      if(!flags.compiler){
        Console.error(`Please specify a compiler using the -c flag: $ bc start:exercises -c=react`);
        return;
      }

      const builderPath = path.resolve(__dirname,`../../utils/config/builder/${flags.compiler}.js`);
      if (!fs.existsSync(builderPath)){
        Console.error(`Uknown compiler: ${flags.compiler}`);
        return;
      }

      fs.readdir('./', function(err, files) {
          if (err) {
            Console.error(`The directory must be empty to start creating the exercises`);
          } else {
            if (!files.length) {
                fs.writeFileSync('./bc.json', JSON.stringify({
                  compiler: flags.compiler
                }, null, 2));

                if (!fs.existsSync('./exercises')){
                    fs.mkdirSync('./exercises');
                }

                if (!fs.existsSync('./exercises/01-hello-world')){
                    fs.mkdirSync('./exercises/01-hello-world');
                }

                fs.writeFileSync('./exercises/01-hello-world/README.md', "# Hello World \n \n Type here your exercise instructions");
            }
            else Console.error(`The directory must be empty in order to start creating the exercises`);
          }
      });
  }
}

StartExercisesComand.description = 'Initialize the boilerplate for creating exercises'
StartExercisesComand.flags = {
 compiler: flags.string({char:'c', description: 'specify what compiler you want: [react, vanilajs, node, python]'}),
}
module.exports = StartExercisesComand
