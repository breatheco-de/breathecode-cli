const Console = require('./console');
const shell = require('shelljs');

module.exports = {
    openFile: function(files){
      files.reverse().forEach(f => {
        if(shell.exec(`gp open ${f}`).code !== 0){
          Console.debug(`Error opening file ${f} on gitpod`);
        }
      });
    }
};
