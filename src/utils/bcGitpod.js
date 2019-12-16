const Console = require('./console');
const shell = require('shelljs');
const socket = require('./bcSocket.js');

module.exports = {
    socket: null,
    config: null,
    initialized: false,
    init: function(){
      if(this.initialized) return;

      if(shell.exec(`gp -h`).code == 0){
        this.hasGPCommand = false;
      }
      else{
        Console.debug(`Gitpod command line tool not found`);
      }
    },
    openFile: async function(files){

      this.init();//initilize gitpod config

      if(this.hasGPCommand) files.reverse().forEach(f => {
        if(shell.exec(`gp open ${f}`).code > 0){
          Console.debug(`Error opening file ${f} on gitpod`);
        };
      });

      socket.log('ready',['Ready to compile or test...']);
    }
};
