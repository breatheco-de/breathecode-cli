const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let Console = require('../../console');
const { java } = require('compile-run');
const { getMatches, cleanStdout } = require('./_utils.js');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, socket }){
    socket.log('compiling',['Compiling...']);

    if( !files || files.length == 0){
      socket.log('compiler-error', [ "No files to compile or build" ]);
      Console.error("No files to compile or build");
      return;
    }

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('App.java') > -1);
    Console.info(`Compiling ${entryPath}...`);
    const content = fs.readFileSync(entryPath, "utf8");
    const count = getMatches(/reader\.readLine\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);
    //JAVA_TOOL_OPTIONS
    const resultPromise = java.runFile(entryPath, {
          stdin: inputs.join('\n'),
          compilationPath: '/home/gitpod/.sdkman/candidates/java/current/bin/javac',
          executionPath: '/home/gitpod/.sdkman/candidates/java/current/bin/java'
        })
        .then(result => {
            socket.clean();

            if(result.exitCode > 0){
              socket.log('compiler-error', [ result.stderr ]);
              bcActivity.error('exercise_error', {
                details: result.stderr,
                framework: null,
                language: 'java',
                message: result.stderr,
                name: bcActivity.getPythonError(result.stderr),
                data: entryPath,
                compiler: 'java'
              });
              Console.error(result.stderr);
            }
            else{
              socket.log('compiler-success', [ cleanStdout(result.stdout, count) ]);
              Console.clean();
              console.log(cleanStdout(result.stdout, count));
            }
        })
        .catch(err => {
            Console.error(err.message || err);
            socket.log('compiler-error',[ err.stderr ]);
            return;
        });
};
