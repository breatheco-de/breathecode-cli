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
              const errors = typeof testingConfig.getErrors != 'undefined' ? testingConfig.getErrors(stdout || stderr) : [];
              let errorLog = [ stdout || stderr ];
              let msg = '';
              if(errors.length > 0){
                msg = `\n\n   You are failing on the following tests: \n ${[...new Set(errors)].map((e,i) => `      ✗ ${i.toString().cyan}. ${e.red.italic} \n`).join()}`;
                errorLog.push(msg);
              }
              socket.log('testing-error', errorLog, [...new Set(errors)]);
              Console.error("There was an error while testing \n"+msg);
            }
            else{
              socket.log('testing-success',[ stdout || stderr ]);
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
        });
    }
    catch(err){
      throw Error([ err.message, err.toString() ]);
    }

};
