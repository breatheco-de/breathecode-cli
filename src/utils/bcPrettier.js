const path = require('path');
const fs = require('fs');
let Console = require('./console');
const prettier = require("prettier");
const bcConfig = require('./bcConfig.js');
//const nodeModulesPath = path.resolve(__dirname, '../../node_modules');
const prettyConfigPath = require.resolve('./config/jest/babelTransform.js');

module.exports = function({ socket, exerciseSlug, fileName }){
    
    return new Promise((resolve, reject) => {
      prettier.resolveConfig(prettyConfigPath).then(options => {
        Console.info("Formatting files.");
        
        if(typeof fileName == undefined){
          var exercises = bcConfig('./');
          exercises.buildIndex();
          const files = exercises.getExerciseDetails(exerciseSlug);
          files.forEach((file)=>{
            const content = fs.readFileSync(file.path, "utf8");
            const formatted = prettier.format(content, options);
            fs.writeFileSync(file.path, formatted);
          });
          
          socket.emit('compiler', { action: 'log', status: 'prettify-success', logs: ['Your code is now pretty and it was saved'] });
          Console.success("Done prettifying, waiting for other actions.");
          resolve();
        }
        else if(typeof fileName == 'string'){
          const filePath = './exercises/'+exerciseSlug+'/'+fileName;
          
          if (!fs.existsSync(filePath)){
            Console.error(`Uknown file: '${filePath}'`);
            socket.emit('compiler', { action: 'log', status: 'internal-error', logs: [`Uknown file: '${filePath}'`] });
            return;
          }
          
          const content = fs.readFileSync(filePath, "utf8");
          const formatted = prettier.format(content, options);
          fs.writeFileSync(filePath, formatted);
          socket.emit('compiler', { action: 'code', status: 'prettify-success', code: formatted, logs: ['Your code is now pretty and it was saved'] });
        }
        else{
          socket.emit('compiler', { action: 'log', status: 'internal-error', logs: ['There was an error formating the code'] });
          Console.error("There was an error formatting the code");
        } 
      })
      .catch(( error ) => reject('There has been an error loading the prettier configuration'));
    });
    
};