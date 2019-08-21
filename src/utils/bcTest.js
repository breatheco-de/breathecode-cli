const path = require('path');
let shell = require('shelljs');
const fs = require('fs');
let Console = require('./console');

module.exports = function({ socket, files, config }){

    const configPath = path.resolve(__dirname,`./config/tester/${config.tester}/${config.compiler}.config.js`);
    if (!fs.existsSync(configPath)){
      Console.error(`No testing engine has been found for: '${config.compiler}'`);
      socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`Uknown testing engine for compiler: '${config.compiler}'`] });
      return;
    }

    try{
      const config = require(configPath)(files);
      config.validate();
      Console.info('Running tests...');
      const { stdout, stderr, code } = shell.exec(config.getCommand());

      if(code != 0) socket.emit('compiler',{ status: 'testing-error', action: 'log', logs: [ stderr, stdout ] });
      else socket.emit('compiler',{ status: 'testing-success', action: 'log', logs: [ stderr, stdout ] });
    }
    catch(err){
      socket.emit('compiler',{ status: 'internal-error', action: 'log', logs: [ err.message, err.toString() ] });
      Console.error(err.message, err.toString());
    }

};
