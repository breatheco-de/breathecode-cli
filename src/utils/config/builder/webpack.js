const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let Console = require('../../console');
//const htmlValidate = require('html-validator');

module.exports = async function({ files, config, port, address, socket, publicPath }){

    socket.removeAllowed('preview'); //restar allowed actions

    let entry = files.filter(f => f.path.indexOf('index.js') > -1 || f.path.indexOf('styles.css') > -1).map(f => './'+f.path);

    const webpackConfigPath = path.resolve(__dirname,`../../config/webpack/${config.compiler}.config.js`);
    if (!fs.existsSync(webpackConfigPath)){
      Console.error(`Uknown compiler: '${config.compiler}'`);
      socket.log('internal-error',[`Uknown compiler: '${config.compiler}'`]);
      return;
    }

    const webpackConfig = require(webpackConfigPath)(files);
    webpackConfig.stats = {
        cached: false,
        cachedAssets: false,
        chunks: false,
        modules: false
    };

    webpackConfig.entry = [
      ...entry,
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

    if(config.compiler === "vanillajs"){
        const prettyConfigPath = require.resolve(`../../config/tester/jest/babelTransform.${config.compiler}.js`);
        const options = await prettier.resolveConfig(prettyConfigPath);
        let htmlErrors = files.filter(f => f.path.indexOf(".html") > -1).map((file)=>{
          const prettyConfig = require(path.resolve(__dirname,`../../config/prettier/${config.compiler}.config.js`));
          const content = fs.readFileSync(file.path, "utf8");

          // const result = (async () => { return JSON.parse(await htmlValidate({ data: content })) })();
          // const errors = result.messages.filter(m => m.type === "error");
          // if(errors.length > 0) return errors;

          const formatted = prettier.format(content, { parser: "html", ...prettyConfig });
          fs.writeFileSync(file.path, formatted);
          return null;
        });

      const foundErrors = [].concat(htmlErrors.filter(e => e !== null));
      if(foundErrors.length > 0){
        socket.log('compiler-error',[ foundErrors.map(e => `Line: ${e.lastLine} ${e.message}`) ]);
        Console.error("Error compiling HTML: ", errors.toString());
        return;
      }
    }

    const compiler = webpack(webpackConfig);
    socket.log('compiling',['Compiling...']);
    compiler.run((err, stats) => {

        if (err) {
            console.error(err);
            socket.log('compiler-error',[ err.message || err ]);
            return;
        }

        const output = stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
        });
        if(stats.hasErrors()){
          socket.log('compiler-error',[ output ]);
        }
        else if(stats.hasWarnings()){
          socket.addAllowed('preview');
          socket.log('compiler-warning',[ output ]);
        }
        else{
          socket.addAllowed('preview');
          socket.log('compiler-success',[ output ]);
        }

    });
};
