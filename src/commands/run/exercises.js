const {Command, flags} = require('@oclif/command');
let Console = require('../../utils/console');
var express = require('express');
const fs = require('fs');
const bcConfig = require('../../utils/bcConfig.js');
const socket = require('../../utils/bcSocket.js');
const bcPrettier = require('../../utils/bcPrettier.js');
const bcTest = require('../../utils/bcTest.js');
var bodyParser = require('body-parser');

class InstructionsCommand extends Command {
  async run() {
    const {flags} = this.parse(InstructionsCommand);

    var app = express();
    var server = require('http').Server(app);

    const download = require('../../utils/bcDownloader.js');
    await download('https://raw.githubusercontent.com/breatheco-de/breathecode-ide/master/dist/app.tar.gz', './_app/app.tar.gz');

    Console.info("Loading the configuration for the exercises.");
    var exercises = bcConfig('./');
    Console.info("Building the exercise index...");
    exercises.buildIndex();
    var config = exercises.getConfig();

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET,PUT");
      next();
    });

    app.get('/exercise', function (req, res) {
        res.json(config.exercises);
    });

    app.get('/readme', function(req, res) {
        res.write(exercises.getReadme());
        res.end();
    });

    app.get('/exercise/:slug/readme', function(req, res) {
        res.write(exercises.getReadme(req.params.slug));
        res.end();
    });

    app.get('/exercise/:slug', function(req, res) {
        res.json(exercises.getExerciseDetails(req.params.slug));
    });

    app.get('/exercise/:slug/file/:fileName', function(req, res) {
        res.write(exercises.getFile(req.params.slug, req.params.fileName));
        res.end();
    });

    app.get('/assets/:fileName', function(req, res) {
        res.write(exercises.getAsset(req.params.fileName));
        res.end();
    });

    const textBodyParser = bodyParser.text();
    app.put('/exercise/:slug/file/:fileName', textBodyParser, function(req, res) {
        const result = exercises.saveFile(req.params.slug, req.params.fileName, req.body);
        res.end();
    });

    app.use('/preview',express.static('dist'));
    app.use('/',express.static('_app'));

    server.listen( flags.port, function () {
      Console.success("Exercises are running 😃 Open your browser to start practicing!")
    });

    socket.start(config.compiler, server);
    socket.on("build", (data) => {
        const builder = require('../../utils/config/builder/'+config.builder+'.js');
        socket.log('compiling',['Building exercise '+data.exerciseSlug]);
        builder({
          files: exercises.getExerciseDetails(data.exerciseSlug),
          socket: socket,
          config: config,
          publicPath: '/preview',
          address: process.env.BREATHECODE_IP || "localhost",
          port: process.env.BREATHECODE_PORT || 8080
        });
    });

    socket.on("run", (data) => {
        const builder = require('../../utils/config/builder/'+config.builder+'.js');
        socket.log('compiling',['Compiling exercise '+data.exerciseSlug]);
        builder({
          files: exercises.getExerciseDetails(data.exerciseSlug),
          socket: socket,
          config
        });
    });

    socket.on("test", (data) => {
        socket.log('testing',['Testing your code output']);
        bcTest({
          files: exercises.getExerciseTests(data.exerciseSlug),
          socket,
          config
        });
    });

    socket.on("prettify", (data) => {
        socket.log('prettifying',['Making your code prettier']);
        bcPrettier({
          config,
          socket,
          exerciseSlug: data.exerciseSlug,
          fileName: data.fileName
        });
    });

  }
}

InstructionsCommand.description = `Runs a small server with all the exercise instructions`;

InstructionsCommand.flags = {
  port: flags.string({char: 'p', description: 'server port', default: '8080' }),
  host: flags.string({char: 'h', description: 'server host', default: process.env.IP || 'localhost' }),
  output: flags.boolean({char: 'o', description: 'show build output on console', default: false })
};
module.exports = InstructionsCommand;
