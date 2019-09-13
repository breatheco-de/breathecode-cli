const fs = require('fs');
let shell = require('shelljs');
const indentString = require('indent-string');
const path = require('path');
const { getInputs, cleanStdout } = require('../../builder/_utils.js');

module.exports = (files) => ({
  config: {
    capture: "sys",
    color: "yes",
  },
  validate: function(){
    if (!shell.which('python3')) {
      const packageName = "python3";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if (!shell.which('pytest')) {
      const packageName = "pytest";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises, run $ pip3 install pytest-testdox mock ${packageName}`);
    }

    //i have to create this conftest.py configuration for pytest, to allow passing the inputs as a parameter
    fs.writeFileSync("./conftest.py", `def pytest_addoption(parser):
    parser.addoption("--stdin", action="append", default=[],
        help="json with the stdin to pass to test functions")

def pytest_generate_tests(metafunc):
    if 'stdin' in metafunc.fixturenames:
        metafunc.parametrize("stdin",metafunc.config.getoption('stdin'))
`)


  },
  getEntryPath: () => {

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('test.py') > -1 || f.indexOf('tests.py') > -1);
    if (!fs.existsSync(entryPath)) throw new Error(`🚫 No tests.py script found on the exercise files`);

    return entryPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);

    const content = fs.readFileSync(appPath, "utf8");
    const count = getInputs(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let answers = (count.length == 0) ? [] : await socket.ask(count);

    return `pytest ${this.getEntryPath()} --testdox --capture=${this.config.capture} --color=${this.config.color} --stdin='${JSON.stringify(answers)}'`
  }

});
