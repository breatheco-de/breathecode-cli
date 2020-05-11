const fs = require('fs');
let shell = require('shelljs');
const indentString = require('indent-string');
const { InternalError, TestingError } = require('../../../errors.js');
const path = require('path');
const Console = require('../../../console.js');
const { getMatches, cleanStdout, indent } = require('../../compiler/_utils.js');

module.exports = (files, config, slug) => ({
  config: {
    capture: "sys",
    color: "yes",
  },
  validate: function(){
    if (!shell.which('python3')) {
      const packageName = "python3";
      throw TestingError(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if (!shell.which('pytest')) {
      const packageName = "pytest";
      throw TestingError(`🚫 You need to have ${packageName} installed to run test the exercises, run $ pip3 install pytest-testdox mock ${packageName}`);
    }

    let venvPythonPath = null;
    if (fs.existsSync("./.venv/lib/") ) {
      const pythons = fs.readdirSync('./.venv/lib/');
      if(pythons.length > 0) venvPythonPath = "./.venv/lib/"+pythons[0];
    }
    //i have to create this conftest.py configuration for pytest, to allow passing the inputs as a parameter
    fs.writeFileSync("./conftest.py", `import sys, os, json
if os.path.isdir("./.venv/lib/"):
    sys.path.append('${venvPythonPath}/site-packages')

def pytest_addoption(parser):
    parser.addoption("--stdin", action="append", default=[],
        help="json with the stdin to pass to test functions")

def pytest_generate_tests(metafunc):
    if 'stdin' in metafunc.fixturenames:
        metafunc.parametrize("stdin",metafunc.config.getoption('stdin'))

    if 'app' in metafunc.fixturenames:
        try:
          sys.path.append('${config.outputPath}')
          import cached_app
          metafunc.parametrize("app",[cached_app.execute_app])
        except SyntaxError:
          metafunc.parametrize("app",[lambda : None])
        except ImportError:
          metafunc.parametrize("app",[cached_app])
        except AttributeError:
          metafunc.parametrize("app",[cached_app])

    if 'config' in metafunc.fixturenames:
        metafunc.parametrize("config", [json.loads('${JSON.stringify(config)}')])
`)


  },
  getEntryPath: () => {

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('test.py') > -1 || f.indexOf('tests.py') > -1);
    if (!fs.existsSync(entryPath)) throw TestingError(`🚫 No tests.py script found on the exercise files`);

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);
    if (fs.existsSync(appPath)){
      let content = fs.readFileSync(appPath, "utf8");
      const count = getMatches(/def\s[a-zA-Z]/gm, content);

      if(count.length == 0){
        Console.debug("Adding main function for all the code");
        content = `def execute_app():\n${indent(content, 4)}`;
      }
      const directory = `${config.outputPath}/cached_app.py`;
      fs.writeFileSync(directory, content);
    }
    else if(config.grading === "isolated") throw TestingError(`🚫 No app.py script found on the exercise files`);

    return entryPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);
    if(appPath !== undefined){
      const content = fs.readFileSync(appPath, "utf8");
      const count = getMatches(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
      let answers = (count.length == 0) ? [] : await socket.ask(count);

      return `pytest ${this.getEntryPath()} --testdox --capture=${this.config.capture} --color=${this.config.color} --stdin='${JSON.stringify(answers)}'`
    }
    else{
      return `pytest ${this.getEntryPath()} --testdox --capture=${this.config.capture} --color=${this.config.color}`
    }
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
      errors.push({ title: found[1], status: 'failed' });
    }

    let _stdout = [stdout];
    if(errors.length > 0){
      msg = `\n\n   ${'Your code must to comply with the following tests:'.red} \n\n${[...new Set(errors)].map((e,i) => `     ${e.status !== 'failed' ? '✓ (done)'.green.bold : 'x (fail)'.red.bold} ${i}. ${e.title.white}`).join('\n')} \n\n`;
      _stdout.push(msg);
    }
    return _stdout;
  }

});
