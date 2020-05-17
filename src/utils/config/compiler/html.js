const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
const HtmlWebpackPlugin = require('html-webpack-plugin');
let Console = require('../../console');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, config, socket }){

    if(!files) return;

    if(typeof config.htmlTemplatePath !== 'undefined'){
        if(fs.existsSync(config.htmlTemplatePath)){
            Console.info('Compiling with special template detected and found: '+config.htmlTemplatePath);
            const htmlPlug = webpackConfig.plugins.find((plugin) => plugin instanceof HtmlWebpackPlugin);
            if(htmlPlug) htmlPlug.options.template = config.htmlTemplatePath;
        }
        else{
            Console.warning('Template not found '+config.htmlTemplatePath);
            Console.help('Check your learn.json template property and fix the path. Using the default template for now.');

        }
    }

    const prettyConfigPath = require.resolve(`../../config/tester/jest/babelTransform.vanillajs.js`);
    const options = await prettier.resolveConfig(prettyConfigPath);
    let htmlErrors = files.filter(f => f.path.indexOf(".html") > -1).map((file)=>{
      const prettyConfig = require(path.resolve(__dirname,`../../config/prettier/${config.compiler}.config.js`));
      const content = fs.readFileSync(file.path, "utf8");
      const formatted = prettier.format(content, prettyConfig);
      fs.writeFileSync(file.path, formatted);
      fs.writeFileSync(`${config.outputPath}/${file.name}`, formatted);
      return null;
    });


    const foundErrors = [].concat(htmlErrors.filter(e => e !== null));
    if(foundErrors.length > 0){
      Console.error("Error compiling HTML: ", errors.toString());
      bcActivity.error('exercise_error', {
        details: foundErrors.map(e => `Line: ${e.lastLine} ${e.message}`).join('\n'),
        framework: null,
        language: 'html',
        message: null,
        name: null,
        compiler: 'html'
      });
      throw CompilerError(foundErrors.map(e => `Line: ${e.lastLine} ${e.message}`));
    }
    else{
      socket.log('compiler-success',[ '' ]);
      Console.success("Successfully built your HTML");
    }
};
