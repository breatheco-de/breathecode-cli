let shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../../../node_modules');
const babelTransformPath = require.resolve('./babelTransform.js');

module.exports = (files) => ({
  config: {
      verbose: true,
      moduleDirectories: [nodeModulesPath],
      prettierPath: nodeModulesPath+'/prettier',
      transform: {
        "^.+\\.js?$": babelTransformPath
      }
  },
  validate: ()=>{
    if (!fs.existsSync(nodeModulesPath+'/prettier')){
      console.error(`Uknown prettier path`);
      return;
    }
    else console.log('Using prettier from '+nodeModulesPath+'/prettier');

    if (!shell.which('jest')) {
      const packageName = "jest@24.8.0";
      Console.fatal(`You need to have ${packageName} installed to run test the exercises`);
      Console.help(`Please run $ npm i ${packageName} -g`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`You need to have jest installed to run test the exercises, please run on your terminal $ npm i ${packageName} -g`] });
      return;
    }
  },
  getEntryPath: () => {

    let testsPath = files.map(f => f.path).find(f => f.indexOf('test.js') > -1 || f.indexOf('tests.js') > -1);
    if (!fs.existsSync(testsPath))  throw new Error(`No test script found on the exercise files`);

    return testsPath;
  },
  getCommand: function(){
    return `jest --config '${JSON.stringify({ ...this.config, testRegex: this.getEntryPath() )}' --colors`
  }

});
