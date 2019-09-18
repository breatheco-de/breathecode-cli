const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let Console = require('../../console');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, config, port, address, socket, publicPath }){

    if(!files) return;

    let entry = files.filter(f => f.path.indexOf('index.js') > -1 || f.path.indexOf('styles.css') > -1).map(f => './'+f.path);
    const webpackConfigPath = path.resolve(__dirname,`../../config/compiler/webpack.config.${config.language}.js`);
    if (!fs.existsSync(webpackConfigPath)){
      Console.error(`Uknown config for webpack and ${config.language}`);
      socket.log('internal-error',[`Uknown config for webpack and ${config.language}`]);
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
            bcActivity.error('exercise_error', {
              details: err.message,
              framework: config.language,
              language: config.language,
              message: result.stderr,
              data: '',
              compiler: 'webpack'
            });
            return;
        }

        const output = stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
        });
        if(stats.hasErrors()){
          socket.log('compiler-error',[ output ]);
          console.log(output);
          bcActivity.error('exercise_error', {
            details: output,
            framework: config.language,
            language: config.language,
            message: result.stderr,
            data: '',
            compiler: 'webpack'
          });
          Console.error("There are some errors in your code");
        }
        else if(stats.hasWarnings()){
          socket.log('compiler-warning',[ output ]);
          console.log(output);
          Console.warning("Your code compiled successfully but with some warnings");
        }
        else{
          socket.log('compiler-success',[ output ]);
          console.log(output);
          Console.success("Successfully built");
        }

    });
};
