const { exec, spawn } = require('child_process')
const Console = require('../console')

module.exports = {
    child: null,
    loading: null,
    allowedCommands: {
      'mysql-start': {cmd: 'mysql-ctl start', msg: ''},
      'mysql-stop': {cmd: 'mysql-ctl stop', msg: ''},
      'mysql-install': {cmd: null, msg: 'Command not compatible, you will have to run it manually: ***$ mysql-ctl install***'},
      'node-upgrade': {cmd: 'nvm install 8', msg: ''},
      'phpmyadmin-install': {cmd: 'phpmyadmin-ctl install', msg: ''}
    },
    getCommand(command) {
        if (typeof(this.allowedCommands[command]) === 'undefined') 
            throw new Error('Invalid command: '+command)
        else if (this.allowedCommands[command].cmd === null) 
            Console.fatal(this.allowedCommands[command].msg)
        
        return this.allowedCommands[command]
    },
    execute(incomingCommand, flags=[]){
        
        let command = this.getCommand(incomingCommand)
        if (!command.cmd) throw new Error('Invalid command, missing cmd property')
        // executes `pwd`
        Console.startLoading()
        Console.info(`Executing: ${command.cmd}`)
        const cmd = exec(command.cmd, flags)
        //setTimeout(() => cmd.stdout.pipe(process.stdout), 1000)
        cmd.stdout.on('data', (data) => {
            Console.stopLoading()
            Console.log(data)
        })
        
        cmd.stderr.on('data', (data) => {
            Console.stopLoading()
            Console.error(`stderr: ${data}`)
            Console.log({
                error: `Try the command manually:`,
                toCopy: ` $ ${command.cmd}`
            })
        })
        
        cmd.on('close', (code) => {
            Console.stopLoading()
            if (code === 0) Console.done()
            else Console.fatal(`Done with error: ***${code}***`)
        })
        
        cmd.on('error', (error) => {
            Console.stopLoading()
            Console.fatal(error)
        })
    },
    advancedExecute(incomingCommand, flags=[]){
        
        let command = this.getCommand(incomingCommand)
        // executes `pwd`
        Console.info(`Executing: ${command}`)
        const cmd = spawn(command, flags)
        
        cmd.stdout.on('data', (data) => {
            Console.stopLoading()
            Console.log(`stdout: ${data}`)
        })
        
        cmd.stderr.on('data', (data) => {
            Console.stopLoading()
            Console.error(`Error!: ${data}`)
        })
        
        cmd.on('close', (code) => {
            Console.stopLoading()
            Console.success(`Done with code: ***${code}***`)
        })
        
        cmd.on('error', (error) => {
            Console.stopLoading()
            Console.error(error)
        })
    }
}