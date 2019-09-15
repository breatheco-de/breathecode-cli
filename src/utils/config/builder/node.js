const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let Console = require('../../console');
const { node } = require('compile-run');
const { getInputs, cleanStdout } = require('./_utils.js');
const bcActivity = require('../../bcActivity.js');

module.exports = async function({ files, socket }){
    socket.log('compiling',['Compiling...']);

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);

    const content = fs.readFileSync(entryPath, "utf8");
    const count = getInputs(/prompt\((?:["'`]{1}(.*)["'`]{1})?\)/gm, content);
    let inputs = (count.length == 0) ? [] : await socket.ask(count);

    const lib = fs.readFileSync(path.resolve(__dirname,'./_node_lib.js'), "utf8");

    const resultPromise = node.runSource(`${lib} ${content}`, { stdin: inputs.join('\n') })
        .then(result => {
            socket.clean();

            if(result.stderr){
              socket.log('compiler-error',[ cleanStdout(result.stdout, count), result.stderr ]);
              bcStats.error('exercise_error', {
                details: result.stderr,
                framework: null,
                language: 'javascript',
                message: null,
                name: null,
                builder: 'breathecode-cli'
              });
            }
            else{
              Console.success("Compiled without errors");
              socket.log('compiler-success',[ cleanStdout(result.stdout, count) ]);
            }
            // else if(stats.hasWarnings()) status = 'compiler-warning';
        })
        .catch(err => {
            Console.error(err);
            socket.log('compiler-error',[ err.stderr ]);
            return;
        });
};
