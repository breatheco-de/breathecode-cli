let shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../../../../node_modules');
const babelTransformPath = require.resolve('./babelTransform.react.js');

module.exports = (files, config, slug='') => ({
  config: {
      verbose: true,
      moduleDirectories: [nodeModulesPath],
      prettierPath: nodeModulesPath+'/prettier',
      transform: {
        "^.+\\.js?$": babelTransformPath
      }
  },
  validate: ()=>{
    if (!fs.existsSync(nodeModulesPath+'/prettier')) throw new Error(`Uknown prettier path`);

    if (!shell.which('jest')) {
      const packageName = "jest@24.8.0";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises, run $ npm i ${packageName} -g`);
    }
  },
  getEntryPath: () => {

    let testsPath = files.map(f => f.path).find(f => f.indexOf('test.js') > -1 || f.indexOf('tests.js') > -1);
    if (!fs.existsSync(testsPath))  throw new Error(`🚫 No test script found on the exercise files`);

    return testsPath;
  },
  getCommand: async function(socket){
    this.config.reporters = ['default',[ __dirname+'/_reporter.js', { reportPath: `./.breathecode/reports/${slug}.json` }]];
    return `jest --config '${JSON.stringify({ ...this.config, testRegex: this.getEntryPath() })}' --colors`
  }

});
