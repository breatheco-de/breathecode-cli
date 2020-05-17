let shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const color = require('colors');
const { InternalError, TestingError } = require('../../../errors.js');
const nodeModulesPath = path.resolve(__dirname, '../../../../../node_modules');
const babelTransformPath = require.resolve('./babelTransform.node.js');
const { getMatches, cleanStdout } = require('../../compiler/_utils.js');

module.exports = (files, config, slug='') => ({
  config: {
      verbose: true,
      moduleDirectories: [nodeModulesPath],
      transform: {
        "^.+\\.js?$": babelTransformPath
      },
      globalSetup: path.resolve(__dirname, './_node_lib.js')
  },
  validate: ()=>{
    if (!fs.existsSync(nodeModulesPath+'/prettier')) throw TestingError(`Uknown prettier path`);

    if (!shell.which('jest')) {
      const packageName = "jest@24.8.0";
      throw TestingError(`🚫 You need to have ${packageName} installed to run test the exercises, run $ npm i ${packageName} -g`);
    }
  },
  getEntryPath: () => {

    let testsPath = files.map(f => f.path).find(f => f.indexOf('test.js') > -1 || f.indexOf('tests.js') > -1);
    if (!fs.existsSync(testsPath))  throw TestingError(`🚫 No test script found on the exercise files`);

    return testsPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);
    const content = fs.readFileSync(appPath, "utf8");
    const count = getMatches(/prompt\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let answers = (count.length == 0) ? [] : await socket.ask(count);

    this.config.reporters = [[ __dirname+'/_reporter.js', { reportPath: `${config.configPath.base}/reports/${slug}.json` }]];
    return `jest --config '${JSON.stringify({ ...this.config, globals: { __stdin: answers }, testRegex: this.getEntryPath() })}' --colors`
  },
  getErrors: () => {
    let stdout = [];
    if (fs.existsSync(`${config.configPath.base}/reports/${slug}.json`)){
      const _text = fs.readFileSync(`${config.configPath.base}/reports/${slug}.json`);
      const errors = JSON.parse(_text);

      stdout = errors.testResults.map(r => r.message);

      if(errors.failed.length > 0){
        msg = `\n\n   ${'Your code must to comply with the following tests:'.red} \n\n${[...new Set(errors.failed)].map((e,i) => `     ${e.status !== 'failed' ? '✓ (done)'.green.bold : 'x (fail)'.red.bold} ${i}. ${e.title.white}`).join('\n')} \n\n`;
        stdout.push(msg);
      }
    }
    else throw TestingError("Could not find the error report for "+slug);

    return stdout;
  }

});
