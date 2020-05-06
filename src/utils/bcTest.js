const path = require('path');
let shell = require('shelljs');
const fs = require('fs');
let { TestingError } = require('./errors');
let Console = require('./console');
const color = require('colors');
const bcActivity = require('./bcActivity.js');

module.exports = async function({ socket, files, config, slug }){

  const configPath = path.resolve(__dirname,`./config/tester/${config.tester}/${config.language}.config.js`);
  if (!fs.existsSync(configPath)) throw CompilerError(`Uknown testing engine for compiler: '${config.language}'`);

      const testingConfig = require(configPath)(files, config, slug);
      testingConfig.validate();

      if(config.ignoreTests) throw TestingError('Grading is disabled on bc.json file.');

      if (!fs.existsSync('./.breathecode/reports')){
        fs.mkdirSync('./.breathecode/reports');
        Console.debug("Creating the ./.breathecode/reports directory");
      }

      Console.info('Running tests...');

      const command = await testingConfig.getCommand(socket)
      const { stdout, stderr, code } = shell.exec(command);

      if(code != 0){
        const errors = typeof(testingConfig.getErrors === 'function') ? testingConfig.getErrors(stdout || stderr) : [];
        socket.log('testing-error', errors);
        console.log(errors.join('\n'))

        Console.error("There was an error while testing");
        bcActivity.error('exercise_error', {
          message: errors,
          name: `${config.tester}-error`,
          framework: config.tester,
          language: config.language,
          data: slug,
          compiler: config.compiler
        });
      }
      else{
        socket.log('testing-success',[ stdout || stderr ].concat(["😁Everything is amazing!"]));
        Console.success("Everything is amazing!");


        bcActivity.activity('exercise_success', {
          language: config.language,
          slug: slug,
          editor: config.editor,
          compiler: config.compiler
        });
        config.exercises = config.exercises.map(e => {
          if(e.slug === slug) e.done = true;
          return e;
        });
      }


      if(typeof testingConfig.cleanup !== "undefined"){
        if(typeof testingConfig.cleanup === 'function' || typeof testingConfig.cleanup === 'object'){
          const clean = await testingConfig.cleanup(socket);
          if(clean){
            const { stdout, stderr, code } = shell.exec(clean);
            if(code == 0){
              Console.debug("The cleanup command runned successfully");
            }
            else Console.warning("There is an error on the cleanup command for the test");
          }

        }
      }

      return true;
};
