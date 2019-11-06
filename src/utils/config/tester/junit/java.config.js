const fs = require('fs');
let shell = require('shelljs');
let Console = require('../../../console');
const indentString = require('indent-string');
const path = require('path');
const { getInputs, cleanStdout } = require('../../compiler/_utils.js');

const installCommands = {
  junit: `curl -0 https://search.maven.org/remotecontent?filepath=junit/junit/4.13-rc-1/junit-4.13-rc-1.jar -o ./.breathecode/junit.jar`,
  hamcrest: `curl -0 https://search.maven.org/remotecontent?filepath=org/hamcrest/hamcrest/2.2/hamcrest-2.2.jar -o ./.breathecode/hamcrest.jar`
};

module.exports = (files) => ({
  config: {
    capture: "sys",
    color: "yes",
  },
  validate: function(){
    if (!shell.which('java')) {
      const packageName = "java";
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if (!fs.existsSync('./.breathecode/junit.jar')){
      if(!this.install('junit')){
        Console.error("There was a problem instaling jUnit");
        throw new Error("There was a problem instaling jUnit");
      }
    }
    if (!fs.existsSync('./.breathecode/hamcrest.jar')){
      if(!this.install('hamcrest')){
        Console.error("There was a problem instaling hamcrest");
        throw new Error("There was a problem instaling hamcrest");
      }
    }
  },
  install: (library) => {
    Console.info("Downloading "+library+"...");
    let child = shell.exec(installCommands[library], { silent: true });
    return child.code === 0;
  },
  getEntryPath: () => {

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('test.java') > -1 || f.indexOf('tests.java') > -1 || f.indexOf('Test.java') > -1 );
    if (!fs.existsSync(entryPath)) throw new Error(`🚫 No tests.java script found on the exercise files`);

    return entryPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('App.java') > -1);

    const content = fs.readFileSync(appPath, "utf8");
    const count = getInputs(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let answers = (count.length == 0) ? [] : await socket.ask(count);

    const cmd = `
      javac -cp ./.breathecode/junit.jar ${this.getEntryPath()} &&
      java -cp ${this.getEntryPath().replace('Test.java', '')}:./.breathecode/junit.jar:./.breathecode/hamcrest.jar org.junit.runner.JUnitCore Test &&
      rm Test.class
    `;
    //Console.log(cmd);
    return cmd
  }

});
