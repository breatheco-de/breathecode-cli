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
      Console.info('Running tests...');
      const { stderr, code } = shell.exec(this.getCommand());

      if(code != 0) socket.emit('compiler',{ status: 'testing-error', action: 'log', logs: [ stderr ] });
      else socket.emit('compiler',{ status: 'testing-success', action: 'log', logs: [ stderr ] });
    }
    catch(err){
      socket.emit('compiler',{ status: 'internal-error', action: 'log', logs: [ err.message, err.toString() ] });
    }

};
