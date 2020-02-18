const path = require('path');
let shell = require('shelljs');
const fs = require('fs');
let { TestingError } = require('./errors');
let Console = require('./console');
const color = require('colors');

module.exports = function({ socket, files, config, slug }){

  const configPath = path.resolve(__dirname,`./config/tester/${config.tester}/${config.language}.config.js`);
  if (!fs.existsSync(configPath)){
    Console.error(`No testing engine has been found for: '${config.language}'`);
    socket.log('internal-error', [`Uknown testing engine for compiler: '${config.language}'`]);
    return;
  }

  try{
    const testingConfig = require(configPath)(files, config, slug);
    console.log(testingConfig);
    testingConfig.validate();

      if(config.ignoreTests) throw TestingError('Grading is disabled on bc.json file.');

      if (!fs.existsSync('./.breathecode/reports')){
        fs.mkdirSync('./.breathecode/reports');
        Console.debug("Creating the ./.breathecode/reports directory");
        return;
      }

      Console.info('Running tests...');

      testingConfig.getCommand(socket)
        .then(command => {

            const { stdout, stderr, code } = shell.exec(command);

            if(code != 0){
              const errors = typeof(testingConfig.getErrors === 'function') ? testingConfig.getErrors(stdout || stderr) : [];
              let errorLog = [];//[ stdout || stderr ];
              socket.log('testing-error', errors);
              console.log(errors.join('\n'))
              Console.error("There was an error while testing");
            }
            else{
              socket.log('testing-success',[ stdout || stderr ].concat(["😁Everything is amazing!"]));
              Console.success("Everything is amazing!");
            }
            if(typeof testingConfig.cleanup !== "undefined"){
              if(typeof testingConfig.cleanup === 'function' || typeof testingConfig.cleanup === 'object') return testingConfig.cleanup(socket);
            }
        })
        .then(command => {
            if(command){
              const { stdout, stderr, code } = shell.exec(command);
              if(code == 0){
                Console.debug("The cleanup command runned successfully");
              }
              else Console.warning("There is an error on the cleanup command for the test");
            }
        })
        .catch(err => {
          throw err;
        });
    }
    catch(err){
      throw err;
    }

};
