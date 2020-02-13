const fs = require('fs');
let shell = require('shelljs');
const indentString = require('indent-string');
const path = require('path');
const Console = require('../../../console.js');
const { getMatches, cleanStdout, indent } = require('../../compiler/_utils.js');

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

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);
    if (!fs.existsSync(appPath)) throw new Error(`🚫 No appy.py script found on the exercise files`);
    let content = fs.readFileSync(appPath, "utf8");
    const count = getMatches(/def\s[a-zA-Z]/gm, content);

    if(count.length == 0){
      Console.log("Adding main function for all the code");
      content = `def execute_app():\n${indent(content, 4)}`;
    }
    const directory = `${path.dirname(entryPath)}/cached.py`;
    Console.log(directory);
    fs.writeFileSync(directory, content);
    return entryPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);

    const content = fs.readFileSync(appPath, "utf8");
    const count = getMatches(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let answers = (count.length == 0) ? [] : await socket.ask(count);

    return `pytest ${this.getEntryPath()} --testdox --capture=${this.config.capture} --color=${this.config.color} --stdin='${JSON.stringify(answers)}'`
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
