const fs = require('fs')
const path = require('path')
let Console = require('../../../console');

class JSONReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  save(result){
    if (typeof(result) !== 'object') throw Error('Results should an object');
    fs.writeFileSync(this._options.reportPath+'/test.json', JSON.stringify(result, null, 2))
  }

  print({ numFailedTests, success, failed }){
    if(!success){
      Console.error(`There are ${numFailedTests} errors in your code: `);
      failed.forEach(error => Console.error(` 𝗑 ${error.title}`))
    }
    else{
      Console.success("Everything is perfect!!");
    }
  }

  parseSuite(suite) {
    const suites = suite.testResults.filter(test => test.status === "failed").map(test => ({ title: test.title }));
    return suites;
  }

  onRunComplete(contexts, results) {
    // console.log('Custom reporter output:');
    // console.log('GlobalConfig: ', this._globalConfig);
    const errorsGroups = (!results.success) ? results.testResults.map(this.parseSuite) : null;
    console.log(errorsGroups);
    const result = {
      success: results.success,
      numFailedTests: results.numFailedTests,
      numPassedTests: results.numPassedTests,
      failed: [].concat.apply([], errorsGroups),
    }
    this.print(result);
    this.save(result);
  }
}
module.exports = JSONReporter;
