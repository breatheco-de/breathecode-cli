const { exec,spawn } = require('child_process');
const colors = require('colors');

module.exports = {
    child: null,
    loading: null,
    allowedCommands: {
      'mysql-start': {cmd: 'mysql-ctl start', msg: ''},
      'mysql-stop': {cmd: 'mysql-ctl stop', msg: ''},
      'mysql-install': {cmd: null, msg: 'Command not compatible, you will have to run it manually: $ mysql-ctl install'},
    },
    getCommand(command){
        if(typeof(this.allowedCommands[command]) === 'undefined') 
            throw new Error('Invalid command: '+command);
        else if(this.allowedCommands[command].cmd === null) 
            console.log(this.allowedCommands[command].msg.white.bgRed);
        
        return this.allowedCommands[command].cmd;
    },
    startLoading(){
      var P = ["\\", "|", "/", "-"];
      var x = 0;
      this.loading = setInterval(function() {
        process.stdout.write("\r" + P[x++]);
        x &= 3;
      }, 250);
    },
    stopLoading(){ clearInterval(this.loading); },
    execute(incomingCommand, flags=[]){
        
        let command = this.getCommand(incomingCommand);
        if(!command) return;
        // executes `pwd`
        console.log(`Executing: ${command}`.white.bgBlue);
        const cmd = exec(command, flags);
        //setTimeout(() => cmd.stdout.pipe(process.stdout), 1000);
        cmd.stdout.on('data', (data) => {
            this.stopLoading();
            console.log(`${data}`.white);
        });
        
        cmd.stderr.on('data', (data) => {
            this.stopLoading();
            console.log(`stderr: ${data}`);
        });
        
        cmd.on('close', (code) => {
            this.stopLoading();
            if(code === 0) console.log(`Done`.white.bgGreen);
            else console.log(`Done with error: ${code}`.white.bgRed);
        });
        
        cmd.on('error', (error) => {
            this.stopLoading();
            console.log(`${error}`.white.bgRed);
        });
    },
    advancedExecute(incomingCommand, flags=[]){
        
        let command = this.getCommand(incomingCommand);
        // executes `pwd`
        console.log(`Executing: ${command}`.white.bgBlue);
        const cmd = spawn(command, flags);
        
        cmd.stdout.on('data', (data) => {
            this.stopLoading();
            console.log(`stdout: ${data}`);
        });
        
        cmd.stderr.on('data', (data) => {
            this.stopLoading();
            console.log(`stderr: ${data}`);
        });
        
        cmd.on('close', (code) => {
            this.stopLoading();
            console.log(`child process exited with code ${code}`);
        });
        
        cmd.on('error', (error) => {
            this.stopLoading();
            console.log(`${error}`.red);
        });
    }
    
}