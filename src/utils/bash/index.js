let fs = require('fs')
let path = require('path')
let shell = require('shelljs')
const fetch = require("node-fetch")
const Console = require('../console')
var readlineSync = require('readline-sync')

module.exports = {
    basePath: __dirname+`/scripts/`,
    scripts: [],
    isValidScript(scriptName){
        if (this.scripts.find(s => s === (scriptName+'.js'))) return true
        else return false
    },
    downloadAndInstall(exercise, flags=null){
      this.install(exercise, flags)
    },
    getScripts(){
        return fs.readdir(this.basePath, (err, files) => {
            this.scripts = files.map(file => {
                return file
            })
        })
    },
    install({ url, folder }, flags=null){

        Console.startLoading()
        Console.info('Verifing git installation')
        if (!shell.which('git')) {
          Console.fatal('Sorry, this script requires git')
          shell.exit(1)
        }

        Console.info('Cloning from '+url)
        if(flags && flags.mode){
            if (shell.exec(`git clone -b ${flags.mode} ${url}`).code !== 0) {
              Console.fatal('Error: Installation failed')
              shell.exit(1)
            }
        }
        else{
            if (shell.exec(`git clone ${url}`).code !== 0) {
              Console.fatal('Error: Installation failed')
              shell.exit(1)
            }
        }

        Console.info('Cleaning installation')
        if (shell.exec(`rm -R -f ./${folder}/.git`).code !== 0) {
          Console.fatal('Error: removing .git directory')
          shell.exit(1)
        }

        let warning = false
        if (flags && flags.root)
        {
            Console.info('Moving to root')

            const commands = [`mv ${folder}/* ./`,`mv ${folder}/.* ./`,`rmdir ${folder}/`]

            var cleanDir = readlineSync.question('This option will clear the entire folder. Continue? (y/n) ');
            cleanDir = cleanDir.toUpperCase();

            if(cleanDir === 'Y'){

                shell.rm('-r', `!(${folder})`);

                Console.error("This functionality was deprecated for security reasons");
            }
            else if (cleanDir === 'N'){
                Console.info(`Please clear this folder if you would like to use the -r option or create another empty directory. Cleaning files and exiting`);
                shell.rm('-r', `${folder}`);
            }
            else{
                Console.error(`${cleanDir} is not a valid option. Cleaning files and exiting.`);
                shell.rm('-r', `${folder}`);
            }
        }
        else{
            if(flags && flags.name){
                const from = folder;
                const to = flags.name;
                if (!shell.test('-d', flags.name)){
                    shell.mkdir('-p', flags.name)
                }
                const commands = [`cp -R ${from}/* ./${to}`,`mv -f ${from}/.* ./${to}`,`rm -R -f ${from}/`]
                commands.forEach((cmd) => {
                    if (shell.exec(cmd).code !== 0) warning = true
                    sleep.sleep(1)
                })
            }
        }
        if (warning) Console.warning(`There seems to be and error when moving the files, make sure there is no ${folder} directory anymore`)

        Console.stopLoading()
        Console.success('Done')
    },
    execute(scriptName, incomingFlags=null){

        return new Promise((resolve, reject) => {

            let flags = ''
            if (incomingFlags) for (var key in incomingFlags) flags += ` --${key} ${(incomingFlags[key]) ? incomingFlags[key] : ''}`
            if (shell.exec(`node ${this.basePath}${scriptName}${flags}`).code !== 0) {
              shell.echo(`Error executing ${scriptName}`)
              shell.exit(1)
              throw `Error executing ${scriptName}`
            }
            else{
                resolve()
            }
        })

    }
}
