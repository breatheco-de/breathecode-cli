let fs = require('fs');
let shell = require('shelljs');

module.exports = {
    basePath: __dirname+`/scripts/`,
    boilerplates: null,
    scripts: [],
    isValidScript(scriptName){
        if(this.scripts.indexOf(scriptName) !== -1) return true;
        else return false;
    },
    validateBoilerplate(type){
        
        let templatePath = `./boilerplates.json`;
        if (!fs.existsSync(templatePath)) throw new Error(`No project boilerplates found in ${templatePath}`.red);
        var boilerplates = JSON.parse(fs.readFileSync(templatePath,{ encoding: 'utf-8'}));
        
        if(typeof(boilerplates[type]) === 'undefined') throw new Error('Invalid boilerplate: '+type);
        
        this.boilerplates = boilerplates;
    },
    getScripts(){
        fs.readdir(this.basePath, (err, files) => {
          this.scripts = files.map(file => {
            return file;
          });
        });
    },
    installBoilerplate(projectType){
         
        this.validateBoilerplate(projectType);
        
        if (!shell.which('git')) {
          shell.echo('Sorry, this script requires git');
          shell.exit(1);
        }
        
        if (shell.exec(`git clone ${this.boilerplates[projectType].url}`).code !== 0) {
          shell.echo('Error: Installation failed');
          shell.exit(1);
        }
        
        
        if (shell.exec(`rm -R -f ./${this.boilerplates[projectType].folder}/.git`).code !== 0) {
          shell.echo('Error: removing .git directory');
          shell.exit(1);
        }
    },
    execute(scriptName){
        
        this.isValidScript(scriptName);
        
        if (shell.exec('node '+this.basePath+scriptName).code !== 0) {
          shell.echo(`Error executing ${scriptName}`);
          shell.exit(1);
        }

    }
}