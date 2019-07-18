const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let Console = require('./console');

module.exports = function({ config, entry, port, address, socket, publicPath }){

    const webpackConfigPath = path.resolve(__dirname,`./config/webpack/${config.compiler}.config.js`);
    if (!fs.existsSync(webpackConfigPath)){
      Console.error(`Uknown compiler: '${config.compiler}'`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`Uknown compiler: '${config.compiler}'`] });
      return;
    }

    const webpackConfig = require(webpackConfigPath);
    webpackConfig.stats = {
        cached: false,
        cachedAssets: false,
        chunks: false,
        modules: false
    };
    webpackConfig.entry = [
      entry,
      `webpack-dev-server/client?http://${address}:${port}`
    ];
    if(typeof config.template !== 'undefined'){
        if(fs.existsSync(config.template)){
            Console.info('Compiling with special template detected and found: '+config.template);
            const htmlPlug = webpackConfig.plugins.find((plugin) => plugin instanceof HtmlWebpackPlugin);
            if(htmlPlug) htmlPlug.options.template = config.template;
        }
        else{
            Console.warning('Template not found '+config.template);
            Console.help('Check your bc.json template property and fix the path. Using the default template for now.');

        }
    }
    if(typeof publicPath != 'undefined') webpackConfig.output.publicPath = publicPath;

    const compiler = webpack(webpackConfig);

    socket.emit('compiler',{ action: 'log', log: ['Compiling...'], status: 'compiling' });
    compiler.run((err, stats) => {

        if (err) {
            console.error(err);
            socket.emit('compiler',{ status: 'compiler-error', action: 'log', logs: [ err.message || err ] });
            return;
        }

        const output = stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
        });
        var status = 'compiler-success';
        if(stats.hasErrors()) status = 'compiler-error';
        else if(stats.hasWarnings()) status = 'compiler-warning';

        socket.emit('compiler',{ status, action: 'log', logs: [ output ] });
    });
};
