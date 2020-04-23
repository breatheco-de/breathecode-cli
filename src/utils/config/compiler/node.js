const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let Console = require('../../console');
let { CompilerError } = require('../../errors');
const { node } = require('compile-run');
const { getMatches, cleanStdout } = require('./_utils.js');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, socket }){
    socket.log('compiling',['Compiling...']);

    if( !files || files.length == 0){
      socket.log('compiler-error', [ "No files to compile or build" ]);
      Console.error("No files to compile or build");
      return;
    }

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);

    const content = fs.readFileSync(entryPath, "utf8");
    const count = getMatches(/prompt\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);

    const lib = fs.readFileSync(path.resolve(__dirname,'./_node_lib.js'), "utf8");

    const result = await node.runSource(`${lib} ${content}`, { stdin: inputs.join('\n') })
    socket.clean();
    if(result.exitCode > 0){
      bcActivity.error('exercise_error', {
        details: result.stderr,
        framework: null,
        language: 'javascript',
        message: null,
        name: null,
        compiler: 'node'
      });
      throw CompilerError(result.stderr);
    }
    else{
      socket.log('compiler-success',[ cleanStdout(result.stdout, count) ]);
      Console.clean();
      console.log(cleanStdout(result.stdout));
    }
};
