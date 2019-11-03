const Console = require('./console');
const shell = require('shelljs');
const socket = require('./bcSocket.js');

module.exports = {
    socket: null,
    config: null,
    openFile: async function(files){

      files.reverse().forEach(f => {
        if(shell.exec(`gp open ${f}`).code > 0){
          Console.debug(`Error opening file ${f} on gitpod`);
        };
      });

      socket.log('ready',['Ready to compile or test...']);
    }
};
