const Console = require('./console');
const shell = require('shelljs');
const socket = require('./bcSocket.js');
const fs = require('fs');
module.exports = {
    socket: null,
    config: null,
    initialized: false,
    init: function(){
      if(this.initialized) return;
      else this.initialized = true;

      if(shell.exec(`gp -h`, { silent: true }).code == 0){
        this.hasGPCommand = true;
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
    },
    setup(){
      this.init();//initilize gitpod config
      this.autosave("on");
    },
    autosave: async function(value="on"){

      this.init();//initilize gitpod config

      if(this.hasGPCommand){
        if (!fs.existsSync('./.theia')) fs.mkdirSync('./.theia');
        if (!fs.existsSync('./.theia/settings.json')){
          fs.writeFileSync(
            './.theia/settings.json',
            JSON.stringify({
                "editor.autoSave": value
            }, null, 4)
          )

        }
      }

    }
};
