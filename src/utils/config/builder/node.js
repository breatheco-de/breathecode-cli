const path = require('path');
const fs = require('fs');
const prettier = require("prettier");
let Console = require('../../console');
const { node } = require('compile-run');

module.exports = function({ files, config, port, address, socket, publicPath }){

    let entryPath = files.map(f => './'+f.path).find(f => f.indexOf('app.js') > -1);

    socket.emit('compiler',{ action: 'log', log: ['Compiling...'], status: 'compiling' });
    const resultPromise = node.runFile(entryPath, { stdin:'3\n2 ' })
        .then(result => {
            console.log("Success",result);//result object
            var status = 'compiler-success';
            if(result.stderr) socket.emit('compiler',{ status: 'compiler-error', action: 'log', logs: [ result.stdout, result.stderr ] });
            else if(result.stdout) socket.emit('compiler',{ status: 'compiler-success', next: { test: true }, action: 'log', logs: [ result.stdout ] });

            // else if(stats.hasWarnings()) status = 'compiler-warning';

        })
        .catch(err => {
            console.error("Error",err);
            socket.emit('compiler',{ status: 'compiler-error', action: 'log', logs: [ err.stderr ] });
            return;
        });
};
