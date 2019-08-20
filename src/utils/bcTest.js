const path = require('path');
let shell = require('shelljs');
const fs = require('fs');
let Console = require('./console');

module.exports = function({ socket, files, config }){

    let testsPath = files.map(f => f.path).find(f => f.indexOf('test.js') > -1 || f.indexOf('tests.js') > -1);

    if (!shell.which('jest')) {
      const packageName = "jest@24.8.0";
      Console.fatal(`You need to have ${packageName} installed to run test the exercises`);
      Console.help(`Please run $ npm i ${packageName} -g`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`You need to have jest installed to run test the exercises, please run on your terminal $ npm i ${packageName} -g`] });
      return;
    }

    if (!fs.existsSync(testsPath)){
      console.log(files);
      Console.error(`Test script does not exists: '${testsPath}'`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`Test script does not exists: '${testsPath}'`] });
      return;
    }

    const configPath = path.resolve(__dirname,`./config/tester/${config.tester}/${config.compiler}.config.js`);
    if (!fs.existsSync(configPath)){
      Console.error(`No testing engine has been found for: '${config.compiler}'`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`Uknown testing engine for compiler: '${config.compiler}'`] });
      return;
    }

    var jestConfig = require(configPath);
    jestConfig.testRegex = testsPath; //path to the tests

    //var spawn = require('child_process').spawn;
    //spawn('node', ['./child.js'], { shell: true, stdio: 'inherit' });
    const command = `jest --config '${JSON.stringify(jestConfig)}' --colors`;
    Console.info('Running: '+command);
    const { stderr, code } = shell.exec(command);
    //const { stderr, code } = shell.exec(command,{ silent: true });
    if(code != 0) socket.emit('compiler',{ status: 'testing-error', action: 'log', logs: [ stderr ] });
    else socket.emit('compiler',{ status: 'testing-success', action: 'log', logs: [ stderr ] });

};
