const path = require('path');
const fs = require('fs');
let shell = require('shelljs');
let Console = require('./console');
const { ValidationError } = require('./errors.js');
const frontMatter = require('front-matter');
let _defaults = require('./config/compiler/_defaults.js');
/* exercise folder name standard */
const validateExerciseDirectoryName = (str) => {
    const regex = /^\d{2,2}(?:\.\d{1,2}?)?-[a-zA-z](?:-|_?[a-zA-z]*)*$/;
    return regex.test(str);
};

const merge = (target, ...sources) =>
  Object.assign(target, ...sources.map(x =>
    Object.entries(x)
      .filter(([key, value]) => typeof value !== 'undefined')
      .reduce((obj, [key, value]) => (obj[key] = value, obj), {})
  ));

module.exports = (filePath, { grading, editor, language, disable_grading }) => {

    const confPath = (fs.existsSync(filePath+'bc.json')) ? './bc.json' : (fs.existsSync(filePath+'./.bc.json')) ? './.bc.json' : (fs.existsSync(filePath+'.breathecode/.bc.json')) ? '.breathecode/.bc.json' : '.breathecode/bc.json';

    let config = { language };
    if (fs.existsSync(confPath)){
      const bcContent = fs.readFileSync(confPath);
      const jsonConfig = JSON.parse(bcContent);
      if(!jsonConfig) throw Error(`Invalid ${confPath} syntax: Unable to parse.`);
      config = merge(jsonConfig,{ language, disable_grading });
      Console.debug("This is your configuration file: ",config);
      if(typeof config.language == 'undefined' && typeof config.compiler == 'undefined'){
        Console.error("The language has to be specified in the bc.json or as the -l=[language] flag");
        throw new Error("The language has to be specified in the bc.json or as the -l=[language] flag");
      }
    }
    else{
      if(typeof config.language == 'undefined' && typeof config.compiler == 'undefined'){
        Console.error("The language has to be specified in the bc.json or as the -l=[language] flag");
        throw new Error("The language has to be specified in the bc.json or as the -l=[language] flag");
      }

      if (!fs.existsSync('./.breathecode')) fs.mkdirSync('./.breathecode');
    }

    let defaults = _defaults[config.language || config.compiler];
    if(typeof defaults == 'undefined'){
      Console.error(`Invalid language or compiler: ${config.language || config.compiler}`);
      throw new Error(`Invalid language or compiler: ${config.language || config.compiler}`);
    }

    // Assign default editor mode if not set already
    if(!config.editor){
      if (shell.which('gp')) config.editor = "gitpod";
      else config.editor = "standalone";
    }

    // if ignoreRegex is saved into a json, it saves as an object abd breaks the cli
    if(config.ignoreRegex && config.ignoreRegex.constructor !== RegExp) delete config.ignoreRegex;

    config = merge(defaults || {}, config, { grading, editor } );
    config.exercisesPath = config.grading === "isolated" ? filePath+'exercises' : filePath+'.breathecode/exercises';

    Console.debug("This is your configuration: ", defaults);
    if (config.grading === 'isolated' && !fs.existsSync(config.exercisesPath))  throw Error(`You are running with ${config.grading} grading, so make sure you have an exercises folder on ${config.exercisesPath}`);

    return {
        getConfig: () => config,
        getTestReport: (slug=null) => {
          if(!slug) throw Error("You have to specify the exercise slug to get the results from");

          const _path = `./.breathecode/reports/${slug}.json`;
          if (!fs.existsSync(_path)) return {};

          const content = fs.readFileSync(_path);
          const data = JSON.parse(content);
          return data;
        },
        getReadme: ({ slug=null, lang=null }) => {
            if(lang == 'us') lang = null; // <-- english is default, no need to append it to the file name
            if(slug){
                const exercise = config.exercises.find(ex => ex.slug == slug);
                if (!exercise) throw ValidationError(`Exercise ${slug} not found`);
                const basePath = exercise.path;
                if (!fs.existsSync(`${basePath}/README${lang ? "."+lang : ''}.md`)){
                  Console.error(`Language ${lang} not found for exercise ${slug}, switching to default language`);
                  if(lang) lang = null;
                  if (!fs.existsSync(`${basePath}/README${lang ? "."+lang : ''}.md`)) throw ValidationError('Readme file not found for exercise: '+basePath+'/README.md');
                }

                const content = fs.readFileSync(`${basePath}/README${lang ? "."+lang : ''}.md`,"utf8");
                const attr = frontMatter(content);
                return attr;
            }
            else{

                if (!fs.existsSync(`./README${lang ? "."+lang : ''}.md`)){
                  Console.error(`Language ${lang} not found for exercise, switching to default language`);
                  if(lang) lang = null;
                  if (!fs.existsSync(`./README${lang ? "."+lang : ''}.md`)) throw ValidationError('Readme file not found');
                }
                return frontMatter(fs.readFileSync(`./README${lang ? "."+lang : ''}.md`,"utf8"));
            }
        },
        getFile: (slug, name) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error(`Exercise ${slug} not found`);
            const basePath = exercise.path;
            if (!fs.existsSync(basePath+'/'+name)) throw ValidationError('File not found: '+basePath+'/'+name);
            else if(fs.lstatSync(basePath+'/'+name).isDirectory()) return 'Error: This is not a file to be read, but a directory: '+basePath+'/'+name;
            return fs.readFileSync(basePath+'/'+name);
        },
        getAsset: (name) => {
            if (!fs.existsSync('./_assets/'+name)) throw ValidationError('File not foundin: ./_assets/'+name);
            return fs.readFileSync('./_assets/'+name);
        },
        saveFile: (slug, name, content) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise '+slug+' not found');
            const basePath = exercise.path;
            if (!fs.existsSync(basePath+'/'+name)) throw ValidationError('File not found: '+basePath+'/'+name);
            return fs.writeFileSync(basePath+'/'+name, content, 'utf8');
        },
        getExerciseDetails: (slug) => {

            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw Error('Exercise not found: '+slug);
            const basePath = exercise.path;

            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getFiles = source => fs.readdirSync(source)
                                        .map(file => ({ path: source+'/'+file, name: file}))
                                            .filter(file =>
                                                // ignore tests files and files with ".hide" on their name
                                                (file.name.toLocaleLowerCase().indexOf('test.') == -1 && file.name.toLocaleLowerCase().indexOf('tests.') == -1 && file.name.toLocaleLowerCase().indexOf('.hide.') == -1 &&
                                                // ignore java compiled files
                                                (file.name.toLocaleLowerCase().indexOf('.class') == -1) &&
                                                // readmes and directories
                                                !file.name.toLowerCase().includes("readme.") && !isDirectory(file.path) && file.name.indexOf('_') != 0) &&
                                                // ignore javascript files when using vanillajs compiler
                                                (!config.ignoreRegex || !config.ignoreRegex.exec(file.name))
                                                ).sort((f1, f2) => {
                                                    const score = { // sorting priority
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
            if(config.grading === 'incremental') return { exercise,  files: getFiles('./') };
            else{
               const _files = getFiles(basePath);
               if (!fs.existsSync('./.breathecode/resets')) fs.mkdirSync('./.breathecode/resets');
               if (!fs.existsSync('./.breathecode/resets/'+slug)){
                 fs.mkdirSync('./.breathecode/resets/'+slug);
                 _files.forEach(f => {
                   if (!fs.existsSync(`./.breathecode/resets/${slug}/${f.name}`)){
                      const content = fs.readFileSync(f.path)
                      fs.writeFileSync(`./.breathecode/resets/${slug}/${f.name}`, content)
                   }
                 });
               }
               return { exercise,  files: _files };
            }
        },
        reset: (slug) => {
          if (!fs.existsSync('./.breathecode/resets/'+slug)) throw new Error("Could not find the original files for "+slug);

          const exercise = config.exercises.find(ex => ex.slug == slug);
          if(!exercise) throw new ValidationError(`Exercise ${slug} not found on the configuration`);

          fs.readdirSync(`./.breathecode/resets/${slug}/`)
            .forEach(fileName => {
              const content = fs.readFileSync(`./.breathecode/resets/${slug}/${fileName}`);
              fs.writeFileSync(`${exercise.path}/${fileName}`, content)
            });
        },
        getAllFiles: (slug) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw ValidationError('Exercise not found: '+slug);
            const basePath = exercise.path;
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getFiles = source => fs.readdirSync(source).map(file => ({ path: source+'/'+file, name: file}));
            return getFiles(basePath);
        },
        buildIndex: function(){
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
            if (!fs.existsSync('./.breathecode')) fs.mkdirSync('./.breathecode');
            if (config.outputPath && !fs.existsSync(config.outputPath)) fs.mkdirSync(config.outputPath);

            // TODO we could use npm library front-mater to read the title of the exercises from the README.md
            config.exercises = getDirectories(config.exercisesPath).map(ex => ({
              slug: ex.substring(ex.indexOf('exercises/')+10),
              title: ex.substring(ex.indexOf('exercises/')+10),
              path: ex
            }));
            config.exercises = config.exercises.map(ex => {
                if(!validateExerciseDirectoryName(ex.slug)){
                    Console.error('Exercise directory "'+ex.slug+'" has an invalid name, it has to start with two digits followed by words separated by underscors or hyphen (no white spaces). e.g: 01.12-hello-world');
                    Console.help('Verify that the folder "'+ex.slug+'" starts with a number and it does not contain white spaces or weird characters.');
                    throw new Error('Error building the exercise index');
                }

                ex.translations = fs.readdirSync(ex.path).filter(file => file.toLowerCase().includes('readme')).map(file => {
                  const parts = file.split('.');
                  if(parts.length === 3) return parts[1];
                  else return "us";
                });
                return ex;
            });

            this.save();
        },
        save: () => {
          fs.writeFileSync(confPath, JSON.stringify(config, null, 4))
        }
    };
};
