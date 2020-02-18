const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let shell = require('shelljs');
let Console = require('../../console');
let { CompilerError } = require('../../errors');
const { python } = require('compile-run');
const { getMatches, cleanStdout } = require('./_utils.js');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, socket }){
    socket.log('compiling',['Compiling...']);

    const packageName = "python3";
    if (!shell.which(packageName)) {
      throw Error(`🚫 You need to have ${packageName} installed to run test the exercises`);
    }

    if( !files || files.length == 0){
      throw Error("No files to compile or build");
    }

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.py') > -1);
    if(!entryPath) throw new Error("This exercise doesn't seem to have an app.py entry file");

    Console.info(`Compiling ${entryPath}...`);
    const content = fs.readFileSync(entryPath, "utf8");
    const count = getMatches(/input\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);

    const resultPromise = python.runFile(entryPath, { stdin: inputs.join('\n'), executionPath: 'python3' })
        .then(result => {
            socket.clean();

            if(result.exitCode > 0){

              bcActivity.error('exercise_error', {
                details: result.stderr,
                framework: null,
                language: 'python3',
                message: result.stderr,
                name: bcActivity.getPythonError(result.stderr),
                data: entryPath,
                compiler: 'python3'
              });
              throw CompilerError(result.stderr);
            }
            else{
              socket.log('compiler-success', [ cleanStdout(result.stdout, count) ]);
              Console.clean();
              Console.log(result.stdout);
            }
        })
        .catch(err => {
            throw CompilerError(err);
        });
};
