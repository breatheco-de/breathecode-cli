let fs = require('fs')
let shell = require('shelljs')
const fetch = require("node-fetch")
const Console = require('../console')
var sleep = require('sleep')

module.exports = {
    basePath: __dirname+`/scripts/`,
    boilerplates: null,
    scripts: [],
    isValidScript(scriptName){
        if (this.scripts.indexOf(scriptName) !== -1) return true
        else return false
    },
    installBoilerplate(type, onRoot=false){
        Console.log('Fetching boilerplates...')
        fetch("https://breatheco-de.github.io/breathecode-cli/boilerplates.json")
        .then(response => {
            response.json().then(boilerplates => {
                if (typeof(boilerplates[type]) === 'undefined') throw new Error('Invalid boilerplate: '+type)
                
                this.boilerplates = boilerplates
                this.install(type, onRoot)
                
            })
        })
        .catch(error => {
            Console.error('There was a problem fetching from https://breatheco-de.github.io/breathecode-cli/boilerplates.json')
            Console.fatal(error)
        })
        
    },
    getScripts(){
        fs.readdir(this.basePath, (err, files) => {
          this.scripts = files.map(file => {
            return file
          })
        })
    },
    install(projectType, onRoot=false){
        
        Console.startLoading()
        Console.log('Verifing git installation')
        if (!shell.which('git')) {
          Console.fatal('Sorry, this script requires git')
          shell.exit(1)
        }
        
        Console.log('Cloning from '+this.boilerplates[projectType].url)
        if (shell.exec(`git clone ${this.boilerplates[projectType].url}`).code !== 0) {
          Console.fatal('Error: Installation failed')
          shell.exit(1)
        }
        
        Console.log('Cleaning installation')
        if (shell.exec(`rm -R -f ./${this.boilerplates[projectType].folder}/.git`).code !== 0) {
          Console.fatal('Error: removing .git directory')
          shell.exit(1)
        }
        
        if (onRoot)
        {
            let warning = false
            Console.log('Moving to root')
            
            const commands = [`mv ${this.boilerplates[projectType].folder}/* ./`,`mv ${this.boilerplates[projectType].folder}/.* ./`,`rmdir ${this.boilerplates[projectType].folder}/`]
            commands.forEach((cmd) => {
                if (shell.exec(cmd).code !== 0) warning = true
                sleep.sleep(1)
            })
            if (warning) Console.warning(`There seems to be and error when moving the files, make sure there is no ${this.boilerplates[projectType].folder} directory anymore`)
        }
        
        Console.stopLoading()
        Console.success('Done')
    },
    execute(scriptName, incomingFlags=null){
        
        this.isValidScript(scriptName)
        
        let flags = ''
        if (incomingFlags) for (var key in incomingFlags) flags += ` --${key} ${(incomingFlags[key]) ? incomingFlags[key] : ''}`
        
        if (shell.exec(`node ${this.basePath}${scriptName}${flags}`).code !== 0) {
          shell.echo(`Error executing ${scriptName}`)
          shell.exit(1)
        }

    }
}