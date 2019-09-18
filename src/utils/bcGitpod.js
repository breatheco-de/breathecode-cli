const Console = require('./console');
const shell = require('shelljs');
const socket = require('./bcSocket.js');

module.exports = {
    socket: null,
    config: null,
    openFile: function(files){

      files.reverse().forEach(f => {
        shell.exec(`gp open ${f}`, (code, stdout, stderr) => {
          if(code !== 0) Console.debug(`Error opening file ${f} on gitpod`);
        });
      });

      socket.log('ready',['Ready to compile...']);
    }
};
