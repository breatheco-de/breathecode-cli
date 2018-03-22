const { exec,spawn } = require('child_process');
const colors = require('colors');

module.exports = {
    child: null,
    loading: null,
    allowedCommands: {
      'mysql-start': {cmd: 'mysql-ctl start', msg: ''},
      'mysql-stop': {cmd: 'mysql-ctl stop', msg: ''},
      'mysql-install': {cmd: null, msg: 'Command not compatible, you will have to run it manually: $ mysql-ctl install'},
      'node-upgrade': {cmd: 'nvm install 8', msg: ''},
      'phpmyadmin-install': {cmd: 'phpmyadmin-ctl install', msg: ''},
    },
    getCommand(command){
        if(typeof(this.allowedCommands[command]) === 'undefined') 
            throw new Error('Invalid command: '+command);
        else if(this.allowedCommands[command].cmd === null) 
            this.log(this.allowedCommands[command].msg.white.bgRed);
        
        return this.allowedCommands[command];
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
        if(!command.cmd) throw new Error('Invalid command, missing cmd property'.red);
        // executes `pwd`
        this.log(`Executing: ${command.cmd}`.white.bgBlue);
        const cmd = exec(command.cmd, flags);
        //setTimeout(() => cmd.stdout.pipe(process.stdout), 1000);
        cmd.stdout.on('data', (data) => {
            this.stopLoading();
            this.log(`${data}`.white);
        });
        
        cmd.stderr.on('data', (data) => {
            this.stopLoading();
            this.log(`stderr: ${data}`.red);
            this.log(`Try the command manually:`.red+` $ ${command.cmd}`.white.bgBlack);
        });
        
        cmd.on('close', (code) => {
            this.stopLoading();
            if(code === 0) this.log(`Done`.white.bgGreen);
            else this.log(`Done with error: ${code}`.white.bgRed);
        });
        
        cmd.on('error', (error) => {
            this.stopLoading();
            this.log(`${error}`.white.bgRed);
        });
    },
    advancedExecute(incomingCommand, flags=[]){
        
        let command = this.getCommand(incomingCommand);
        // executes `pwd`
        this.log(`Executing: ${command}`.white.bgBlue);
        const cmd = spawn(command, flags);
        
        cmd.stdout.on('data', (data) => {
            this.stopLoading();
            this.log(`stdout: ${data}`);
        });
        
        cmd.stderr.on('data', (data) => {
            this.stopLoading();
            this.log(`stderr: ${data}`);
        });
        
        cmd.on('close', (code) => {
            this.stopLoading();
            this.log(`Done with code: ${code}`);
        });
        
        cmd.on('error', (error) => {
            this.stopLoading();
            this.log(`${error}`.red);
        });
    },
    log(msg){
        console.log(this.linkify(msg));
    },
    linkify(text) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function(url) {
            return  url.underline.blue;
        });
    }
}