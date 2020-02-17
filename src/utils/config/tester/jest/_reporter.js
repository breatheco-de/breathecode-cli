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

  print({ numFailedTestSuites, failed, testResults }){
    if(numFailedTestSuites > 0){
      let _success = true;
      console.log(testResults.map(e => e.failureMessage).join("\n"));
      console.log("");
      failed.forEach(error => {
        console.log(` ${error.status !== 'failed' ? '✓'.green.bold : 'x'.red.bold} ${error.title.white}`);
      });
      console.log('');
      Console.error(`Some of your code is not working as expected, read above ↑`);
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
    // console.log("Results", results);
    const errorsGroups = (!results.success) ? results.testResults.map(this.parseSuite) : null;
    const result = {
      success: results.success,
      numFailedTestSuites: results.numFailedTestSuites,
      numFailedTests: results.numFailedTests,
      numPassedTests: results.numPassedTests,
      testResults: results.testResults.map(r => ({ message: r.failureMessage, errorType: r.testExecError })),
      failed: [].concat.apply([], errorsGroups),
    }
    //this.print(result);
    this.save(result);
  }
}
module.exports = JSONReporter;
