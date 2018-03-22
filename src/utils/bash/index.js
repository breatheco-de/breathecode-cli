let fs = require('fs');
let shell = require('shelljs');
const fetch = require("node-fetch");
const Console = require('../console');

module.exports = {
    basePath: __dirname+`/scripts/`,
    boilerplates: null,
    scripts: [],
    isValidScript(scriptName){
        if(this.scripts.indexOf(scriptName) !== -1) return true;
        else return false;
    },
    installBoilerplate(type){
        Console.log('Fetching boilerplates...'); 
        fetch("https://breatheco-de.github.io/breathecode-cli/boilerplates.json")
        .then(response => {
            response.json().then(boilerplates => {
                if(typeof(boilerplates[type]) === 'undefined') throw new Error('Invalid boilerplate: '+type);
                
                this.boilerplates = boilerplates;
                this.install(type);
                
            });
        })
        .catch(error => {
            Console.error('There was a problem fetching from https://breatheco-de.github.io/breathecode-cli/boilerplates.json');
            Console.fatal(error);
        });
        
    },
    getScripts(){
        fs.readdir(this.basePath, (err, files) => {
          this.scripts = files.map(file => {
            return file;
          });
        });
    },
    install(projectType){
        
        Console.log('Verifing git installation'); 
        if (!shell.which('git')) {
          Console.fatal('Sorry, this script requires git');
          shell.exit(1);
        }
        
        Console.log('Cloning from '+this.boilerplates[projectType].url); 
        if (shell.exec(`git clone ${this.boilerplates[projectType].url}`).code !== 0) {
          Console.fatal('Error: Installation failed');
          shell.exit(1);
        }
        
        
        Console.log('Cleaning installation'); 
        if (shell.exec(`rm -R -f ./${this.boilerplates[projectType].folder}/.git`).code !== 0) {
          Console.fatal('Error: removing .git directory');
          shell.exit(1);
        }
        
        Console.success('Done'); 
    },
    execute(scriptName){
        
        this.isValidScript(scriptName);
        
        if (shell.exec('node '+this.basePath+scriptName).code !== 0) {
          shell.echo(`Error executing ${scriptName}`);
          shell.exit(1);
        }

    }
}