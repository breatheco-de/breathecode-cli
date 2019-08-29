const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let Console = require('../../console');
const { node } = require('compile-run');

module.exports = function({ files, socket }){

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);

    socket.log('compiling',['Compiling...']);
    const resultPromise = node.runFile(entryPath, { stdin:'3\n2 ' })
        .then(result => {
            socket.clean();
            Console.success("Compiled without errors");
            if(result.stderr) socket.log('compiler-error',[ result.stdout, result.stderr ]);
            else if(result.stdout) socket.log('compiler-success',[ result.stdout ]);
            // else if(stats.hasWarnings()) status = 'compiler-warning';
        })
        .catch(err => {
            Console.error(err);
            socket.log('compiler-error',[ err.stderr ]);
            return;
        });
};
