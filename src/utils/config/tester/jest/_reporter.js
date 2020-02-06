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
    fs.writeFileSync(this._options.reportPath, JSON.stringify(result, null, 2))
  }

  print({ numFailedTests, success, failed }){
    if(!success){
      Console.error(`Some of your code is not working as expected:`);
      console.log("");
      failed.forEach(error => console.log(` ${error.status !== 'failed' ? '✓'.green.bold : 'x'.red.bold} ${error.title.white}`))
      console.log('');
    }
    else{
      Console.success("Everything is perfect!!");
    }
  }

  parseSuite(suite) {
    const suites = suite.testResults.map(({title, status}) => ({ title, status }));
    return suites;
  }

  onRunComplete(contexts, results) {
    const errorsGroups = (!results.success) ? results.testResults.map(this.parseSuite) : null;
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
