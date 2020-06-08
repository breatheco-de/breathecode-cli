const path = require('path');
const fs = require('fs');
let shell = require('shelljs');
let Console = require('./console');
let watch = require('./watcher');
const Gitpod = require('./bcGitpod.js');
const { ValidationError, NotFoundError } = require('./errors.js');
const frontMatter = require('front-matter');
let _defaults = require('./config/compiler/_defaults.js');
/* exercise folder name standard */
const validateExerciseDirectoryName = (str) => {
    const regex = /^\d{2,3}(?:\.\d{1,2}?)?-[a-zA-z](?:-|_?[a-zA-z]*)*$/;
    return regex.test(str);
};

const merge = (target, ...sources) =>
  Object.assign(target, ...sources.map(x =>
    Object.entries(x)
      .filter(([key, value]) => typeof value !== 'undefined')
      .reduce((obj, [key, value]) => (obj[key] = value, obj), {})
  ));

const getConfigPath = () => {
  const possibleFileNames = ['learn.json', '.learn/learn.json','bc.json','.breathecode/bc.json'];
  let config = possibleFileNames.find(file => fs.existsSync(file)) || null;
  if(config && fs.existsSync(".breathecode")) return { config, base: ".breathecode" };
  return { config, base: ".learn" };
}

const getExercisesPath = (base) => {
  const possibleFileNames = ['./exercises',base+'/exercises'];
  return possibleFileNames.find(file => fs.existsSync(file)) || null;
}

module.exports = ({ grading, editor, language, disable_grading }) => {

    let confPath = getConfigPath();
    Console.debug("This is the config path: ", confPath);

    let config = { language };
    if (confPath){
      const bcContent = fs.readFileSync(confPath.config);
      const jsonConfig = JSON.parse(bcContent);
      if(!jsonConfig) throw Error(`Invalid ${confPath.config} syntax: Unable to parse.`);

      //add using id to the installation
      if(!jsonConfig.session) jsonConfig.session = Math.floor(Math.random() * 10000000000000000000);

      config = merge(jsonConfig,{ language, disable_grading });
      Console.debug("This is your configuration file: ",config);
      if(typeof config.language == 'undefined' && typeof config.compiler == 'undefined'){
        Console.error(`The language has to be specified in the ${confPath.config} or as the -l=[language] flag`);
        throw new Error(`The language has to be specified in the ${confPath.config} or as the -l=[language] flag`);
      }
    }
    else{
      throw ValidationError("No learn.json file has been found, make sure you are in the folder");
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

    config = merge(defaults || {}, config, { grading, editor, configPath: confPath } );
    config.configPath.exercises = getExercisesPath(confPath.base);
    config.configPath.output = confPath.base+"/dist";

    Console.debug("This is your updated configuration: ", config);

    if(config.editor === "gitpod") Gitpod.setup(config);

    if (config.grading === 'isolated' && !config.configPath.exercises)  throw Error(`You are running with ${config.grading} grading, so make sure you have an "exercises" folder`);

    return {
        getConfig: () => config,
        getTestReport: (slug=null) => {
          if(!slug) throw Error("You have to specify the exercise slug to get the results from");

          const _path = `${config.confPath.base}/reports/${slug}.json`;
          if (!fs.existsSync(_path)) return {};

          const content = fs.readFileSync(_path);
          const data = JSON.parse(content);
          return data;
        },
        getReadme: ({ slug=null, lang=null }) => {
            if(lang == 'us') lang = null; // <-- english is default, no need to append it to the file name
            if(slug){
                const exercise = config.exercises.find(ex => ex.slug == slug);
                if (!exercise) throw NotFoundError(`Exercise ${slug} not found`);
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
            if (!exercise) throw NotFoundError(`Exercise ${slug} not found`);
            const basePath = exercise.path;
            if (!fs.existsSync(basePath+'/'+name)) throw ValidationError('File not found: '+basePath+'/'+name);
            else if(fs.lstatSync(basePath+'/'+name).isDirectory()) return 'Error: This is not a file to be read, but a directory: '+basePath+'/'+name;
            return fs.readFileSync(basePath+'/'+name);
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
            if (!exercise) throw NotFoundError('Exercise not found: '+slug);
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
               if (!fs.existsSync(`${config.configPath.base}/resets`)) fs.mkdirSync(`${config.configPath.base}/resets`);
               if (!fs.existsSync(`${config.configPath.base}/resets/`+slug)){
                 fs.mkdirSync(`${config.configPath.base}/resets/`+slug);
                 _files.forEach(f => {
                   if (!fs.existsSync(`${config.configPath.base}/resets/${slug}/${f.name}`)){
                      const content = fs.readFileSync(f.path)
                      fs.writeFileSync(`${config.configPath.base}/resets/${slug}/${f.name}`, content)
                   }
                 });
               }
               return { exercise,  files: _files };
            }
        },
        reset: (slug) => {
          if (!fs.existsSync(`${config.configPath.base}/resets/`+slug)) throw new Error("Could not find the original files for "+slug);

          const exercise = config.exercises.find(ex => ex.slug == slug);
          if(!exercise) throw new ValidationError(`Exercise ${slug} not found on the configuration`);

          fs.readdirSync(`${config.configPath.base}/resets/${slug}/`)
            .forEach(fileName => {
              const content = fs.readFileSync(`${config.configPath.base}/resets/${slug}/${fileName}`);
              fs.writeFileSync(`${exercise.path}/${fileName}`, content)
            });
        },
        getAllFiles: (slug) => {
            const exercise = config.exercises.find(ex => ex.slug == slug);
            if (!exercise) throw NotFoundError('Exercise not found: '+slug);
            const basePath = exercise.path;
            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getFiles = source => fs.readdirSync(source).map(file => ({ path: source+'/'+file, name: file}));
            return getFiles(basePath);
        },
        buildIndex: function(){
            Console.info("Building the exercise index...");

            const isDirectory = source => fs.lstatSync(source).isDirectory();
            const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
            if (!fs.existsSync(config.configPath.base)) fs.mkdirSync(config.configPath.base);
            if (config.configPath.output && !fs.existsSync(config.configPath.output)) fs.mkdirSync(config.configPath.output);

            // TODO we could use npm library front-mater to read the title of the exercises from the README.md
            config.exercises = getDirectories(config.configPath.exercises).map((ex, i) => {
              const slug = ex.substring(ex.indexOf('exercises'+path.sep)+10);
              return {
                slug, title: slug,
                //if the exercises was on the config before I may keep the status done
                done: (Array.isArray(config.exercises) && typeof config.exercises[i] !== 'undefined' && ex.substring(ex.indexOf('exercises/')+10) == config.exercises[i].slug) ? config.exercises[i].done : false,
                path: ex
              };
            });
            config.exercises = config.exercises.map(ex => {
                if(!validateExerciseDirectoryName(ex.slug)){
                    Console.error('Exercise directory "'+ex.slug+'" has an invalid name, it has to start with two or three digits followed by words separated by underscors or hyphen (no white spaces). e.g: 01.12-hello-world');
                    Console.help('Verify that the folder "'+ex.slug+'" starts with a number and it does not contain white spaces or weird characters.');
                    throw ValidationError('Error building the exercise index');
                }

                const files = fs.readdirSync(ex.path);
                ex.translations = files.filter(file => file.toLowerCase().includes('readme')).map(file => {
                  const parts = file.split('.');
                  if(parts.length === 3) return parts[1];
                  else return "us";
                });

                ex.graded = files.filter(file => file.toLowerCase().startsWith('test.') || file.toLowerCase().startsWith('tests.')).length > 0

                return ex;
            });
            this.save();
        },
        watchIndex: function(onChange=null){

          if(!config.configPath.exercises) throw ValidationError("No exercises directory to watch");

          this.buildIndex();
          watch(config.configPath.exercises)
            .then((eventname, filename) => {
              Console.debug("Changes detected on your exercises")
              this.buildIndex();
              if(onChange) onChange();
            })
            .catch(error => {
               throw error;
            })
        },
        save: () => {

          // we don't want the user to be able to manipulate the configuration path
          //delete config.configPath;
          //delete config.configPath.exercises;

          fs.writeFileSync(config.configPath.config, JSON.stringify(config, null, 4))
        }
    };
};
