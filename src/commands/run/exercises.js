const {Command, flags} = require('@oclif/command');
let Console = require('../../utils/console');
var express = require('express');
const bcConfig = require('../../utils/bcConfig.js');
const socket = require('../../utils/bcSocket.js');
const bcPrettier = require('../../utils/bcPrettier.js');
const bcTest = require('../../utils/bcTest.js');
const Session = require('../../utils/bcSession.js');
const Gitpod = require('../../utils/bcGitpod.js');
var bodyParser = require('body-parser');

class InstructionsCommand extends Command {
  async run() {
    const {flags} = this.parse(InstructionsCommand);

    Console.debugging(flags.debug);

    Console.info("Loading the configuration for the exercises.");
    var exercises = bcConfig('./', { mode: flags.mode, editor: flags.editor, language: flags.language });
    Console.info("Building the exercise index...");
    exercises.buildIndex();
    var config = exercises.getConfig();

    Console.info(`Compiler: ${config.compiler}, mode: ${config.mode}, editor: ${config.editor}, for ${Array.isArray(config.exercises) ? config.exercises.length : 0} exercises found`);

    var app = express();
    var server = require('http').Server(app);

    Session.get().then(s => s ? Console.info(`Hello ${s.payload.email}.`) : Console.debug("No active session available"));

    const download = require('../../utils/bcDownloader.js');
    await download('https://raw.githubusercontent.com/breatheco-de/breathecode-ide/master/dist/app.tar.gz', './.breathecode/_app/app.tar.gz');


    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET,PUT");
      next();
    });

    app.get('/config', function (req, res) {
        res.json(config);
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

    app.use('/preview', express.static(config.outputPath));
    app.use('/',express.static('.breathecode/_app'));

    server.listen( config.port, function () {
      Console.success("Exercises are running 😃 Open your browser to start practicing!")
    });

    socket.start(config, server);
    socket.on("gitpod-open", (data) => {
      Console.debug("Opening these files on gitpod: ", data);
      Gitpod.openFile(data.files);
    });
    socket.on("preview", (data) => {
      Console.debug("Preview triggered, removing the 'preview' action ");
      socket.removeAllowed("preview");
      socket.log('ready',['Ready to compile...']);
    });

    socket.on("build", (data) => {
        const compiler = require('../../utils/config/compiler/'+config.compiler+'.js');
        socket.log('compiling',['Building exercise '+data.exerciseSlug]);
        const files = exercises.getAllFiles(data.exerciseSlug);

        compiler({
          files,
          socket,
          config
        });
    });

    socket.on("run", (data) => {
        const compiler = require('../../utils/config/compiler/'+config.compiler+'.js');
        socket.log('compiling',['Compiling exercise '+data.exerciseSlug]);
        compiler({
          files: exercises.getExerciseDetails(data.exerciseSlug),
          socket: socket,
          config
        });
    });

    socket.on("test", (data) => {
        socket.log('testing',['Testing your code output']);
        bcTest({
          files: exercises.getAllFiles(data.exerciseSlug),
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
  language: flags.string({char:'l', description: 'specify what language you want: [html, css, react, vanilajs, node, python]'}),
  port: flags.string({char: 'p', description: 'server port' }),
  host: flags.string({char: 'h', description: 'server host' }),
  debug: flags.boolean({char: 'd', description: 'debugger mode fro more verbage', default: false }),
  editor: flags.string({ char: 'e', description: '[standalone, gitpod]', options: ['standalone', 'gitpod'], default: 'standalone' }),
  mode: flags.string({ char: 'm', description: '[exercises, tutorial]', options: ['exercises', 'tutorial'], default: 'exercises' }),
};
module.exports = InstructionsCommand;
