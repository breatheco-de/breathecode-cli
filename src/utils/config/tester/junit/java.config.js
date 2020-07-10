const fs = require('fs');
let shell = require('shelljs');
let Console = require('../../../console');
const { InternalError, TestingError } = require('../../../errors.js');
const indentString = require('indent-string');
const path = require('path');
const { getMatches, cleanStdout } = require('../../compiler/_utils.js');
const https = require('https');

const libraryPaths = {
  jmock: `https://repo1.maven.org/maven2/org/jmock/jmock-junit4/2.12.0/jmock-junit4-2.12.0.jar`,
  mockito: `https://search.maven.org/remotecontent?filepath=org/mockito/mockito-core/3.2.0/mockito-core-3.2.0.jar`,
  objenesis: `https://repo1.maven.org/maven2/org/objenesis/objenesis/3.1/objenesis-3.1.jar`,
  bytebuddy: `https://search.maven.org/remotecontent?filepath=net/bytebuddy/byte-buddy/1.10.4/byte-buddy-1.10.4.jar`,
  junit: `https://search.maven.org/remotecontent?filepath=junit/junit/4.13-rc-1/junit-4.13-rc-1.jar`,
  hamcrest: `https://search.maven.org/remotecontent?filepath=org/hamcrest/hamcrest/2.2/hamcrest-2.2.jar`
};

module.exports = (files, config, slug) => ({
  config: {
    capture: "sys",
    color: "yes",
  },
  validate: async function(){
    if (!shell.which('java')) {
      const packageName = "java";
      throw TestingError(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if (!fs.existsSync(`${config.configPath.base}/mockito.jar`)){
      try{
        await download(libraryPaths['mockito'],`${config.configPath.base}/mockito.jar`);
        await download(libraryPaths['bytebuddy'],`${config.configPath.base}/bytebuddy.jar`);
        await download(libraryPaths['objenesis'],`${config.configPath.base}/objenesis.jar`);
      }catch(error){
        Console.error("There was a problem instaling mockito, bytebuddy or objenesis", error);
        throw TestingError("There was a problem instaling mockito, bytebuddy or objenesis");
      }
    }

    if (!fs.existsSync(`${config.configPath.base}/junit.jar`)){
      try{
        await download(libraryPaths['junit'],`${config.configPath.base}/junit.jar`)
      }catch(error){
        Console.error("There was a problem instaling jUnit", error);
        throw TestingError("There was a problem instaling jUnit");
      }
    }
    if (!fs.existsSync(`${config.configPath.base}/hamcrest.jar`)){
      try{
        await download(libraryPaths['hamcrest'],`${config.configPath.base}/hamcrest.jar`)
      }catch(error){
        Console.error("There was a problem instaling hamcrest", error);
        throw TestingError("There was a problem instaling hamcrest");
      }
    }

    return true;
  },
  install: (library) => {
    if(!fs.existsSync(`${__dirname}/static/java/mockito.jar`)){
      Console.debug(`Not found ${__dirname}/static/java/mockito.jar`);
      Console.info("Downloading "+library+"...");
      let child = shell.exec(installCommands(config)[library], { silent: true });
      return child.code === 0;
    }
    else{
      Console.info("Installing "+library+"...");
      let child = shell.exec(`cp ${__dirname}../../static/java/${library}.jar ${config.configPath.base}/${library}.jar`, { silent: true });
      return child.code === 0;
    }
  },
  getEntryPath: () => {

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('test.java') > -1 || f.indexOf('tests.java') > -1 || f.indexOf('Test.java') > -1 );
    if (!fs.existsSync(entryPath)) throw TestingError(`🚫 No tests.java script found on the exercise files`);

    return entryPath;
  },
  getCommand: async function(socket){

    const appPath = files.map(f => './'+f.path).find(f => f.indexOf('App.java') > -1);

    // const content = fs.readFileSync(appPath, "utf8");
    // const count = getMatches(/reader\.readLine\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    // let answers = (count.length == 0) ? [] : await socket.ask(count);

    const rootPath = this.getEntryPath().replace('Test.java', '');
    const cmds = [
    `javac -cp ${config.configPath.base}/mockito.jar:${config.configPath.base}/junit.jar ${this.getEntryPath()} ${appPath}`,
    `java -cp ${rootPath}:${config.configPath.base}/hamcrest.jar:${config.configPath.base}/objenesis.jar:${config.configPath.base}/bytebuddy.jar:${config.configPath.base}/mockito.jar:${config.configPath.base}/junit.jar org.junit.runner.JUnitCore Test`
    ];
    return cmds
  },
  getErrors: (stdout) => {

    return [stdout];
  },
  cleanup: async function(socket){
    const rootPath = this.getEntryPath().replace('Test.java', '');
    if (fs.existsSync(`${rootPath}*.class`)) return `
      rm ${rootPath}*.class
    `;
    else return null;
  }

});

function download(url, dest) {
  Console.info("Downloading to "+dest)
  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest, { flags: 'wx' });
        file.on('finish', () => {
          resolve()
        });
        file.on('error', err => {
          file.close();
          if (err.code === 'EEXIST') reject('File already exists');
          else fs.unlink(dest, () => reject(err.message)); // Delete temp file
        });
        response.pipe(file);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        Console.debug("Maven servers redirected to "+response.headers.location)
        //Recursively follow redirects, only a 200 will resolve.
        download(response.headers.location, dest)
        .then(() => resolve())
        .catch(error => {
            Console.error(error)
            reject(error)
          });
      } else {
        reject(`Maven server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    });

    request.on('error', err => {
      reject(err.message);
    });
  });
}
