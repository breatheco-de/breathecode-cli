let shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../../../../node_modules');

module.exports = (files) => ({
  config: {
      verbose: true,
      moduleDirectories: [nodeModulesPath],
      prettierPath: nodeModulesPath+'/prettier',
      testResultsProcessor: nodeModulesPath+'/jest-json-repoter'
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
    console.log(this.config);
    return `jest --config '${JSON.stringify({ ...this.config, testRegex: this.getEntryPath() })}' --colors`
  },
  getErrors(stdout){
    //@pytest.mark.it('1. Your code needs to print Yellow on the console')
    var regex = /@pytest\.mark\.it\(["'](.+)["']\)/gm;
    let errors = [];
    let found = null;
    while ((found = regex.exec(stdout)) !== null){
      if (found.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      errors.push(found[1]);
    }
    return errors;
  }

});
