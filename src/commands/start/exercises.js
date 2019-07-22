const {Command} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
const path = require('path');
class StartExercisesComand extends Command {
  async run() {

      const { flags } = this.parse(StartExercisesComand);
      Console.info(`Creating exercises boilerplate...`)

      if(!flags.compiler) Console.error(`Please specify a compiler using the -c flag: $ bc start:exercises -c=react`);

      const webpackConfigPath = path.resolve(__dirname,`../utils/config/webpack/${flags.compiler}.config.js`);
      if (!fs.existsSync(webpackConfigPath)){
        Console.error(`Uknown compiler: '${flags.compiler}'`);
      }

  }
}

StartExercisesComand.description = 'Initialize the boilerplate for creating exercises'
StartExercisesComand.flags = {
 compiler: flags.boolean({char:'c', description: 'specify what compiler you want: [react, vanilajs]'}),
}
module.exports = StartExercisesComand
