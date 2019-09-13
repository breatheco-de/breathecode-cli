const path = require('path');
let shell = require('shelljs');
const fs = require('fs');
let Console = require('./console');

module.exports = function({ socket, files, config }){

    const configPath = path.resolve(__dirname,`./config/tester/${config.tester}/${config.compiler}.config.js`);
    if (!fs.existsSync(configPath)){
      Console.error(`No testing engine has been found for: '${config.compiler}'`);
      socket.log('internal-error', [`Uknown testing engine for compiler: '${config.compiler}'`]);
      return;
    }

    try{
      const config = require(configPath)(files);
      config.validate();
      Console.info('Running tests...');

      config.getCommand(socket)
        .then(command => {

            const { stdout, stderr, code } = shell.exec(command);

            if(code != 0) socket.log('testing-error',[ stderr, stdout ]);
            else socket.log('testing-success',[ stderr, stdout ]);
        });
    }
    catch(err){
      socket.log('internal-error',[ err.message, err.toString() ]);
      Console.error(err.message, err.toString());
    }

};
