const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let shell = require('shelljs');
let Console = require('../../console');
const { python } = require('compile-run');
const { getInputs, cleanStdout } = require('./_utils.js');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, socket }){
    socket.log('compiling',['Compiling...']);

    const packageName = "python3";
    if (!shell.which(packageName)) {
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if( !files || files.length == 0){
      socket.log('compiler-error', [ "No files to compile or build" ]);
      Console.error("No files to compile or build");
      return;
    }
    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);
    Console.info(`Compiling ${entryPath}...`);
    const content = fs.readFileSync(entryPath, "utf8");
    const count = getInputs(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);

    const resultPromise = python.runFile(entryPath, { stdin: inputs.join('\n'), executionPath: 'python3' })
        .then(result => {
            socket.clean();

            if(result.exitCode > 0){
              socket.log('compiler-error', [ result.stderr ]);
              bcActivity.error('exercise_error', {
                details: result.stderr,
                framework: null,
                language: 'python3',
                message: result.stderr,
                name: bcActivity.getPythonError(result.stderr),
                data: entryPath,
                compiler: 'python3'
              });
              console.log(result.stderr);
              Console.error("There was an error");
            }
            else{
              socket.log('compiler-success', [ cleanStdout(result.stdout, count) ]);
              Console.clean();
              console.log(result.stdout);
            }
        })
        .catch(err => {
            Console.error(err.message || err);
            socket.log('compiler-error',[ err.stderr ]);
            return;
        });
};
