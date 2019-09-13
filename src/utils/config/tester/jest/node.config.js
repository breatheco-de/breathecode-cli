let shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../../../../node_modules');
const babelTransformPath = require.resolve('./babelTransform.node.js');
const { getInputs, cleanStdout } = require('../../builder/_utils.js');

module.exports = (files) => ({
  config: {
      verbose: true,
      moduleDirectories: [nodeModulesPath],
      transform: {
        "^.+\\.js?$": babelTransformPath
      },
      globalSetup: path.resolve(__dirname, './_node_lib.js')
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

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);
    const content = fs.readFileSync(appPath, "utf8");
    const count = getInputs(/prompt\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let answers = (count.length == 0) ? [] : await socket.ask(count);

    return `jest --config '${JSON.stringify({ ...this.config, globals: { __stdin: answers }, testRegex: this.getEntryPath() })}' --colors`
  }

});
