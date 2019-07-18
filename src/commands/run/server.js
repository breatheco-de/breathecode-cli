const {Command, flags} = require('@oclif/command');
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
let Console = require('../../utils/console');
const fs = require('fs');
const path = require('path');

class HelloCommand extends Command {
  async run() {
    const {flags} = this.parse(HelloCommand);
      
      let webpackConfig = null;
      if(!flags.compiler){
        Console.error('You need to explicity specify a compiler between: [react,vanillajs]');
        Console.help('For example: $ bc run:server -c=react');
        return;
      }
      
      if(!flags.entry){
        if (fs.existsSync('./index.js')) flags.entry = './index.js';
        else{
          Console.error('There needs to be an index.js in your current directory or you could specify a different the entry path using the -e flag');
          Console.help(`For example: $ bc run:server -e='./index.js'`);
          return;
        }
      }
      
      const webpackConfigPath = path.resolve(__dirname,`../../utils/config/webpack/${flags.compiler}.config.js`);
      if (!fs.existsSync(webpackConfigPath)){
        Console.error(`Uknown compiler '${flags.compiler}' specified`);
        return;
      }
      
      webpackConfig = require(webpackConfigPath);
      webpackConfig.entry = [
        flags.entry,
        `webpack-dev-server/client?http://${process.env.IP}:${process.env.PORT}`
      ];
      const compiler = webpack(webpackConfig);
      var server = new webpackDevServer(compiler, webpackConfig.devServer);
      server.listen(flags.port, flags.host, function() {
          Console.success('A server has started runing at: http://'+flags.host+':'+flags.port);
          Console.info('Finishing bundle... wait...');
      });
  }
}

HelloCommand.description = `Runs a dummy server without any configuration`;

HelloCommand.flags = {
  compiler: flags.string({char: 'c', description: 'compiler type: react, vanillajs, etc.', default: null }),
  entry: flags.string({char: 'e', description: 'entry file path for the server', default: null }),
  port: flags.string({char: 'p', description: 'server port', default: process.env.PORT || '8080' }),
  host: flags.string({char: 'h', description: 'server host', default: process.env.IP || 'localhost' })
};

module.exports = HelloCommand;
