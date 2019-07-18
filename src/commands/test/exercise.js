const {Command, flags} = require('@oclif/command');
let fs = require('fs');
const webpack = require('webpack');
let Console = require('../../utils/console');
const path = require('path');

class HelloCommand extends Command {
  async run() {
    const {flags} = this.parse(HelloCommand);
    if (fs.existsSync('./bc.json')) {
      let webpackConfig = null;
      if(flags.number){
        //if(shell.which('jest') && shell.which('babel-cli')){
          var bcConfig = JSON.parse(fs.readFileSync('./bc.json', 'utf8'));
          const webpackConfigPath = path.resolve(__dirname,`../../utils/config/webpack.${bcConfig.compiler}.js`);
          if (!fs.existsSync(webpackConfigPath)){
            Console.error(`Uknown compiler '${bcConfig.compiler}' specified on the bc.json file`);
            return;
          }
          
          webpackConfig = require(webpackConfigPath);
        
          webpackConfig.output.filename = flags.number + '.bundle.js';
          webpackConfig.devtool = false;
          webpackConfig.output.path = process.cwd() + '/compiled';
          webpackConfig.entry = './exercises/'+flags.number+'/index.js';
          const compiler = webpack(webpackConfig);
          compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
              console.log(stats.toString({
                colors: true
              }));
              Console.error("There was an error compiling, review above");
              return;
            }
            Console.success("Your code compiled successfully");
          });
        // }
        // else{
        //   Console.error('Please install jest globally to test your exercises');
        //   Console.help('$ npm i jest babel-cli -g');
        // }
      }
      else{
        Console.error('You need to explicity specify what exercise number');
        Console.help('For example: $ bc run-exercise -n=1');
      }
    }
    else{
      this.error('No bc.json file found');
    }
  }
}

HelloCommand.description = `Run a particular exercise in the browser`

HelloCommand.flags = {
  number: flags.string({char: 'n', description: 'number of the exercise', default: null }),
}

module.exports = HelloCommand
