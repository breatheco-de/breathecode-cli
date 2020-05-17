const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let Console = require('../../console');
let { CompilerError } = require('../../errors');
const bcActivity = require('../../bcActivity.js');

const run = (compiler) => new Promise((res, rej) => compiler.run((err, stats) => {
  res({ err, stats });
}));

module.exports = async ({ files, config, socket }) => {
  if(!files){
    socket.log('compiler-error',[`No files to compile or build`]);
    return;
  }

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
  // the url were webpack will publish the preview
  webpackConfig.devServer.contentBase = config.configPath.output;
  webpackConfig.output.path = process.cwd() + '/' + config.configPath.output;
  //the base directory for the preview, the bundle will be dropped here
  webpackConfig.output.publicPath = config.publicPath;

  webpackConfig.entry = [
    ...entry,
    `webpack-dev-server/client?http://${config.address}:${config.port}`
  ];
  if(typeof config.webpack_template !== 'undefined'){
    if(config.webpack_template && fs.existsSync(config.webpack_template)){
      Console.info('Compiling with special template '+config.webpack_template);
      webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: config.webpack_template,
        favicon: __dirname + '/favicon.png'
      }));
    }
    else{
      Console.warning('Template not found '+config.webpack_template);
      Console.help('Check your learn.json template property and fix the path. Using the default template for now.');
    }
  }

  if(config.language !== "react"){
    const prettyConfigPath = require.resolve(`../../config/tester/jest/babelTransform.vanillajs.js`);
    const options = await prettier.resolveConfig(prettyConfigPath);
    let htmlErrors = files.filter(f => f.path.indexOf(".html") > -1).map((file)=>{
      const prettyConfig = require(path.resolve(__dirname,`../../config/prettier/vanillajs.config.js`));
      const content = fs.readFileSync(file.path, "utf8");

      // const result = (async () => { return JSON.parse(await htmlValidate({ data: content })) })();
      // const errors = result.messages.filter(m => m.type === "error");
      // if(errors.length > 0) return errors;
      try{
        const formatted = prettier.format(content, { parser: "html", ...prettyConfig });
        fs.writeFileSync(file.path, formatted);
        fs.writeFileSync(`${config.configPath.output}/${file.name}`, formatted);
      }
      catch(error){
        return error;
      }
      return null;
    });

    const foundErrors = [].concat(htmlErrors.filter(e => e !== null));
    if(foundErrors.length > 0){
      const errors = foundErrors.map(e => e.message);
      // socket.log('compiler-error',[ errors.join("\n") ]);
      Console.error("Error compiling HTML: "+errors.join("\n"));
      throw CompilerError(errors[0]);
    }
  }

  const compiler = webpack(webpackConfig);
  socket.log('compiling',['Compiling...']);
  const { err, stats } = await run(compiler);

  if (err) {
      bcActivity.error('exercise_error', {
        details: err.message,
        framework: config.language,
        language: config.language,
        message: err.message,
        data: '',
        compiler: 'webpack'
      });
      throw CompilerError(err);
  }

  const output = stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
  });
  if(stats.hasErrors()){
    bcActivity.error('exercise_error', {
      details: output,
      framework: config.language,
      language: config.language,
      message: output,
      data: '',
      compiler: 'webpack'
    });
    Console.error("Your code has some errors");
    throw CompilerError(output);
  }
  else if(stats.hasWarnings()){
    socket.log('compiler-warning',[ output ]);
    console.log(output);
    Console.warning("Your code compiled successfully but with some warnings");
    return;
  }
  else{
    socket.log('compiler-success',[ output ]);
    console.log(output);
    Console.success("Successfully built");
    return;
  }

}
