const path = require('path');
const fs = require('fs');
let Console = require('./console');
/* exercise folder name standard */
const validateExerciseDirectoryName = (str) => {
    const regex = /^\d{2,2}(?:\.\d{1,2}?)?-[a-zA-z](?:-|_?[a-zA-z]*)*$/;
    return regex.test(str);
};

const _defaults = {
  "vanillajs": {
    builder: "webpack",
    tester: "jest"
  },
  "react": {
    builder: "webpack",
    tester: "jest"
  },
  "python3": {
    builder: "python3",
    tester: "pytest"
  },
  "node": {
    builder: "node",
    tester: "jest"
  }
}

module.exports = (filePath) => {

    if (!fs.existsSync(filePath+'bc.json')) throw Error('Imposible to load bc.json, make sure you have a ./bc.json file on your current path');
    if (!fs.existsSync(filePath+'exercises')) throw Error('Imposible to exercises folder, make sure you have an exercises folder on your current path');

    const bcContent = fs.readFileSync('./bc.json');
    let config = JSON.parse(bcContent);
    let defaults = _defaults[config.compiler];
    config = { ...config, ...defaults };
    if(!config) throw Error('Invalid bc.json syntax: Unable to parse.');

    Console.info(`Compiler: ${config.compiler} for ${Array.isArray(config.exercises) ? config.exercises.length : 0} exercises found`);

    return {
        getConfig: () => config,
        getReadme: (slug=null) => {
            if(slug){
                const exercise = config.exercises.find(ex => ex.slug == slug);
                if (!exercise) throw Error('Exercise not found');
                const basePath = exercise.path;
                if (!fs.existsSync(basePath+'/README.md')) throw Error('Readme file not found for exercise: '+basePath+'/README.md');
                return fs.readFileSync(basePath+'/README.md');
            }
            else{
                if (!fs.existsSync('./README.md')) throw Error('Readme file not found');
                return fs.readFileSync('./README.md');
            }
        },
        getFile: (slug, name) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise not found');
            const basePath = exercise.path;
            if (!fs.existsSync(basePath+'/'+name)) throw Error('File not found: '+basePath+'/'+name);
            else if(fs.lstatSync(basePath+'/'+name).isDirectory()) return 'Error: This is not a file to be read, but a directory: '+basePath+'/'+name;
            return fs.readFileSync(basePath+'/'+name);
        },
        getAsset: (name) => {
            if (!fs.existsSync('./_assets/'+name)) throw Error('File not foundin: ./_assets/'+name);
            return fs.readFileSync('./_assets/'+name);
        },
        saveFile: (slug, name, content) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise '+slug+' not found');
            const basePath = exercise.path;
            if (!fs.existsSync(basePath+'/'+name)) throw Error('File not found: '+basePath+'/'+name);
            return fs.writeFileSync(basePath+'/'+name, content, 'utf8');
        },
        getExerciseDetails: (slug) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise not found: '+slug);
            const basePath = exercise.path;
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getFiles = source => fs.readdirSync(source)
                                        .map(file => ({ path: source+'/'+file, name: file}))
                                            // TODO: we could implement some way for teachers to hide files from the developer, like putting on the name index.hidden.js
                                            .filter(file => (file.name != 'tests.js' && file.name != 'README.md' && !isDirectory(file.path))) // hide directories, readmes and tests
                                                .sort((f1, f2) => {
                                                    const score = { //sorting priority
                                                      "index.html": 1,
                                                      "styles.css": 2,
                                                      "styles.scss": 2,
                                                      "style.css": 2,
                                                      "style.scss": 2,
                                                      "index.css": 2,
                                                      "index.scss": 2,
                                                      "index.js": 3,
                                                    };
                                                    return score[f1.name] < score[f2.name] ? -1 : 1;
                                                });
            return getFiles(basePath);
        },
        getExerciseTests: (slug) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise not found: '+slug);
            const basePath = exercise.path;
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getFiles = source => fs.readdirSync(source)
                                        .map(file => ({ path: source+'/'+file, name: file}))
                                            // TODO: we could implement some way for teachers to hide files from the developer, like putting on the name index.hidden.js
                                            .filter(file => (file.name.indexOf('tests.') > -1 )); // hide directories, readmes and tests
            return getFiles(basePath);
        },
        buildIndex: () => {
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

            // TODO we could use npm library front-mater to read the title of the exercises from the README.md
            config.exercises = getDirectories(filePath+'exercises').map(ex => ({ slug: ex.replace('exercises/',''), title: ex.replace('exercises/',''), path: ex}));
            config.exercises.forEach(d => {
                if(!validateExerciseDirectoryName(d.slug)){
                    Console.error('Exercise directory "'+d.slug+'" has an invalid name, it has to start with two digits followed by words separated by underscors or hyphen (no white spaces). e.g: 01.12-hello-world');
                    Console.help('Verify that the folder "'+d.slug+'" starts with a number and it does not contain white spaces or weird characters.');
                    throw new Error('Error building the exercise index');
                }
            });

            return {
                write: (callback) => fs.writeFile(filePath+'bc.json', JSON.stringify(config, null, 4), callback)
            };
        }
    };
};
