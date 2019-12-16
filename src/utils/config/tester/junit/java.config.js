const fs = require('fs');
let shell = require('shelljs');
let Console = require('../../../console');
const indentString = require('indent-string');
const path = require('path');
const { getInputs, cleanStdout } = require('../../compiler/_utils.js');

const installCommands = {
  jmock: `curl -0 https://repo1.maven.org/maven2/org/jmock/jmock-junit4/2.12.0/jmock-junit4-2.12.0.jar -o ./.breathecode/jmock.jar`,
  mockito: `curl -0 https://search.maven.org/remotecontent?filepath=org/mockito/mockito-core/3.2.0/mockito-core-3.2.0.jar -o ./.breathecode/mockito.jar`,
  objenesis: `curl -0 https://repo1.maven.org/maven2/org/objenesis/objenesis/3.1/objenesis-3.1.jar -o ./.breathecode/objenesis.jar`,
  bytebuddy: `curl -0 https://search.maven.org/remotecontent?filepath=net/bytebuddy/byte-buddy/1.10.4/byte-buddy-1.10.4.jar -o ./.breathecode/bytebuddy.jar`,
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

    if (!fs.existsSync('./.breathecode/mockito.jar')){
      if(!this.install('mockito') || !this.install('bytebuddy') || !this.install('objenesis')){
        Console.error("There was a problem instaling mockito");
        throw new Error("There was a problem instaling mockito");
      }
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

    // const content = fs.readFileSync(appPath, "utf8");
    // const count = getInputs(/reader\.readLine\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    // let answers = (count.length == 0) ? [] : await socket.ask(count);

    const rootPath = this.getEntryPath().replace('Test.java', '');
    const cmd = `
      javac -cp ./.breathecode/mockito.jar:./.breathecode/junit.jar ${this.getEntryPath()} ${appPath} &&
      java -cp ${rootPath}:./.breathecode/hamcrest.jar:./.breathecode/objenesis.jar:./.breathecode/bytebuddy.jar:./.breathecode/mockito.jar:./.breathecode/junit.jar org.junit.runner.JUnitCore Test
    `;
    return cmd
  },
  cleanup: async function(socket){
    const rootPath = this.getEntryPath().replace('Test.java', '');
    if (fs.existsSync(`${rootPath}*.class`)) return `
      rm ${rootPath}*.class
    `;
    else return null;
  }

});
