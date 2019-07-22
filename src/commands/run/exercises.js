const {Command, flags} = require('@oclif/command');
let Console = require('../../utils/console');
var express = require('express');
const bcConfig = require('../../utils/bcConfig.js');
const bcCompiler = require('../../utils/bcCompiler.js');
const bcPrettier = require('../../utils/bcPrettier.js');
const bcTest = require('../../utils/bcTest.js');
var bodyParser = require('body-parser');
class InstructionsCommand extends Command {
  async run() {
    const {flags} = this.parse(InstructionsCommand);

    var app = express();
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

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
        var config = exercises.getConfig();
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
        Console.success("To start solving the exercises go to the following link: "+flags.host+":"+flags.port);
    });

    io.on('connection', function (socket) {
      Console.info("Conection with client successfully established");
      socket.emit('compiler', { action: 'log', status: 'ready', logs: ['Ready to compile...'] });
      socket.on('compiler', function ({action, data}) {
        if(typeof data.exerciseSlug == 'undefined'){
          socket.emit('compiler', { action: 'log', status: 'internal-error', logs: ['No exercise slug specified'] });
          Console.error("No exercise slug especified");
          return;
        }
        const entryURL = './exercises/'+data.exerciseSlug;
        socket.emit('compiler',{ action: 'clean', status: 'pending', logs: ['Working...'] });

        switch(action){
          case "build":
            socket.emit('compiler', { action: 'log', status: 'compiling', logs: ['Compiling exercise '+data.exerciseSlug, 'Entry '+entryURL+'/index.js'] });
            bcCompiler({
              socket: socket,
              config: config,
              entry: entryURL+'/index.js',
              publicPath: '/preview',
              address: process.env.BREATHECODE_IP || "localhost",
              port: process.env.BREATHECODE_PORT || 8080
            });
          break;
          case "test":
            socket.emit('compiler', { action: 'log', status: 'testing', logs: ['Testing your code output'] });
            bcTest({
              socket: socket,
              config: config,
              excercise: data.exerciseSlug,
              testsPath: entryURL+'/tests.js'
            });
          break;
          case "prettify":
            socket.emit('compiler', { action: 'log', status: 'prettifying', logs: ['Making your code prettier'] });
            bcPrettier({
              socket,
              exerciseSlug: data.exerciseSlug,
              fileName: data.fileName
            });
          break;
          default:
            socket.emit('compiler', { action: 'log', status: 'internal-error', logs: ['Uknown action'] });
          break;
        }
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
