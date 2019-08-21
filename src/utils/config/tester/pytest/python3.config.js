const fs = require('fs');
let shell = require('shelljs');

module.exports = (files) => ({
  config: {
    capture: "sys",
    color: "yes",
  },
  validate: ()=>{
    if (!shell.which('python3')) {
      const packageName = "python3";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if (!shell.which('pytest')) {
      const packageName = "pytest";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises, run $ pip3 install pytest-testdox ${packageName}`);
    }
  },
  getEntryPath: () => {

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('test.py') > -1 || f.indexOf('tests.py') > -1);
    if (!fs.existsSync(entryPath))  throw new Error(`🚫 No tests.py script found on the exercise files`);

    return entryPath;
  },
  getCommand: function(){
    return `pytest ${this.getEntryPath()} --testdox --capture=${this.config.capture} --color=${this.config.color}`
  }

});
