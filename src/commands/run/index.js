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
    Console.debug("These are your flags: ",flags);
    var exercises = bcConfig('./', { grading: flags.grading, editor: flags.editor, language: flags.language, disable_grading: flags.disable_grading });
    Console.info("Building the exercise index...");
    exercises.buildIndex();
    var config = exercises.getConfig();

    Console.info(`Compiler: ${config.compiler}, grading: ${config.grading} ${config.disable_grading ? "(disabled)" : ""}, editor: ${config.editor}, for ${Array.isArray(config.exercises) ? config.exercises.length : 0} exercises found`);

    var app = express();
    var server = require('http').Server(app);

    const s = await Session.get();
    if(s) Console.info(`Hello ${s.payload.email}.`);
    else Console.debug("No active session available");

    const download = require('../../utils/bcDownloader.js');
    await download('https://raw.githubusercontent.com/breatheco-de/breathecode-ide/master/dist/app.tar.gz', './.breathecode/_app/app.tar.gz');


    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "GET,PUT");
      next();
    });

    //client error handler
    const withHandler = (func) => (req, res) => {
      try{
        func(req, res);
      }
      catch(err){
        Console.debug(err);
        const _err = {
          message: err.message || 'There has been an error' ,
          status: err.status || 500,
          type: err.type || null
        };
        Console.error(_err.message);

        //send rep to the server
        res.status(_err.status);
        res.json(_err);
      }
    };

    app.get('/config', withHandler((req, res)=>{
        res.json(config);
    }));

    app.get('/exercise', withHandler((req, res) => {
        res.json(config.exercises);
    }));

    app.get('/readme', withHandler((req, res)=>{
        const readme = exercises.getReadme({ lang: req.query.lang || null, slug: null });
        res.json(readme);
    }));

    app.get('/exercise/:slug/readme', withHandler((req, res) => {
        const readme = exercises.getReadme({ lang: req.query.lang || null, slug: req.params.slug });
        res.json(readme);
    }));

    app.get('/exercise/:slug/report', withHandler((req, res) => {
        const report = exercises.getTestReport(req.params.slug);
        res.json(JSON.stringify(report));
    }));

    app.get('/exercise/:slug', withHandler((req, res) => {
        res.json(exercises.getExerciseDetails(req.params.slug));
    }));

    app.get('/exercise/:slug/file/:fileName', withHandler((req, res) => {
        res.write(exercises.getFile(req.params.slug, req.params.fileName));
        res.end();
    }));

    app.get('/assets/:fileName', withHandler((req, res) => {
        res.write(exercises.getAsset(req.params.fileName));
        res.end();
    }));

    const textBodyParser = bodyParser.text();
    app.put('/exercise/:slug/file/:fileName', textBodyParser, withHandler((req, res) => {
        const result = exercises.saveFile(req.params.slug, req.params.fileName, req.body);
        res.end();
    }));

    if(config.outputPath) app.use('/preview', express.static(config.outputPath));

    app.use('/',express.static('.breathecode/_app'));

    server.listen( config.port, function () {
      Console.success(`Exercises are running 😃 Open your browser to start practicing!`);
      Console.success(`\n            Here is your exercises link:`);
      if(config.editor === 'gitpod') Console.log(`            https://${config.port}-${config.address.substring(8)}`);
      else Console.log(`            ${config.address}:${config.port}`);
    });

    socket.start(config, server);
    socket.on("gitpod-open", (data) => {
      Console.debug("Opening these files on gitpod: ", data);
      Gitpod.openFile(data.files);
    });
    socket.on("reset", (exercise) => {
      Console.debug("Reseting exercise "+exercise.exerciseSlug);
      try{
        exercises.reset(exercise.exerciseSlug);
        socket.log('ready',['Ready to compile...']);
      }
      catch(error){
        socket.log('error',[error.message || "There was an error reseting the exercise"]);
      }
    });
    socket.on("preview", (data) => {
      Console.debug("Preview triggered, removing the 'preview' action ");
      socket.removeAllowed("preview");
      socket.log('ready',['Ready to compile...']);
    });

    socket.on("build", (data) => {
        const compiler = require('../../utils/config/compiler/'+config.compiler+'.js');
        // socket.log('compiling',['Building exercise '+data.exerciseSlug]);
        const files = exercises.getAllFiles(data.exerciseSlug);

        compiler({ files, socket, config })
          // .then(() => console.log("Finish running"))
          .catch(error => {
            console.log("Finish running with error");
            const message = error.message || 'There has been an uknown error';
            socket.log(error.type || 'internal-error', [ message ], [], error);
            Console.error(message);
            Console.debug(error);
          })
    });

    socket.on("run", (data) => {
        const compiler = require('../../utils/config/compiler/'+config.compiler+'.js');
        socket.log('compiling',['Compiling exercise '+data.exerciseSlug]);
        compiler({
          files: exercises.getExerciseDetails(data.exerciseSlug).files,
          socket: socket,
          config
        })
        .catch(error => {
          const message = error.message || 'There has been an uknown error';
          socket.log(error.type || 'internal-error', [ message ], [], error);
          Console.error(message);
          Console.debug(error);
        })
    });

    socket.on("test", (data) => {
        socket.log('testing',['Testing your code output']);
        bcTest({
          files: exercises.getAllFiles(data.exerciseSlug),
          socket,
          config,
          slug: data.exerciseSlug
        })
        .then(result => {
          exercises.save();
        })
        .catch(error => {
          const message = error.message || 'There has been an uknown error';
          socket.log(error.type || 'internal-error', [ message ], [], error);
          Console.error(message);
          Console.debug(error);
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
  debug: flags.boolean({char: 'd', description: 'debugger mode for more verbage', default: false }),
  disable_grading: flags.boolean({char: 'dg', description: 'disble grading functionality', default: false }),
  editor: flags.string({ char: 'e', description: '[standalone, gitpod]', options: ['standalone', 'gitpod'] }),
  grading: flags.string({ char: 'g', description: '[isolated, incremental]', options: ['isolated', 'incremental'] }),
};
module.exports = InstructionsCommand;
