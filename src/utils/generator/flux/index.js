let fs = require('fs');
const colors = require('colors');

module.exports = {
    paths: {
        src: { path: './src', defaultName: null},
        js: { path: './src/js', defaultName: null},
        store: { path: './src/js/stores', defaultName: 'MyStore'},
        action: { path: './src/js/actions', defaultName: 'MyActions'},
        component: { path: './src/js/components', defaultName: 'MyComponent'},
        view: { path: './src/js/views', defaultName: 'MyView'}
    },
    validatePath(type){
        if(typeof(this.paths[type]) === 'undefined') throw new Error(`Invalid type: ${type}`.red);
        else if(typeof(this.paths[type].path) === 'undefined') throw new Error(`Missing folder path for type: ${type}`.red);
    },
    createHierarchy(){
        for(let key in this.paths){
            let folder = this.paths[key].path;   
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        }
    },
    generate(type, fileName = null){
        
        this.validatePath(type);
        if(!fileName) fileName = this.paths[type].defaultName;
        let filePath = `./src/js/${type}s/${fileName}.js`;
        if (fs.existsSync(filePath)) throw new Error(type+' '+fileName+'.js already exists'.red);
        
        let templatePath = __dirname+`/templates/${type}.js`;
        if (!fs.existsSync(templatePath)) throw new Error('No template defined for generating '+type+'s'.red);
        else{
            var template = fs.readFileSync(templatePath,{ encoding: 'utf-8'});
            fs.writeFileSync(filePath,eval('`'+template+'`'), {encoding: 'utf-8'});
        }
    }
}