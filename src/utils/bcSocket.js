
let connect = require('socket.io');
let Console = require('./console');

const allActions = ['build', 'prettify', 'test', 'run'];
const status = ['prettifying', 'testing', 'compiling'];
module.exports = {
    socket: null,
    lang: null,
    allowed: {
        python3: ['run', 'test'],
        python: ['run', 'test'],
        vanillajs: ['build', 'test'],
        react: ['build', 'test'],
        node: ['run', 'test']
    },
    addAllowed: function(action){
        this.allowed[this.lang].push(action);
    },
    removeAllowed: function(action){
        this.allowed[this.lang] = this.allowed[this.lang].filter(a => a !== action);
    },
    actionCallBacks: {
        clean: (data, s) => {
            s.logs = [];
        }
    },
    start: function(config, server){
        this.lang = config.compiler;
        this.socket = connect(server);
        this.socket.on('connection', (socket) => {
          Console.debug("Connection with client successfully established");
          this.log('ready',['Ready to compile...']);

          socket.on('compiler', ({action, data}) => {

            this.emit('clean','pending',['Working...']);

            if(typeof data.exerciseSlug == 'undefined'){
              this.log('internal-error',['No exercise slug specified']);
              Console.error("No exercise slug especified");
              return;
            }

            if(typeof this.actionCallBacks[action] == 'function') this.actionCallBacks[action](data);
            else this.log('internal-error',['Uknown action '+action]);

          });
        });
    },
    on: function(action, callBack){
        this.actionCallBacks[action] = callBack;
    },
    clean: function(status='pending', logs=[]){
      this.emit('clean','pending',logs);
    },
    ask: function(questions=[]){

      return new Promise((resolve, reject) => {
        this.emit('ask','pending', ["Waiting for input..."], questions);
        this.on('input', ({ inputs }) => resolve(inputs));
      })
    },
    log: function(status, messages=[]){
      this.emit('log',status,messages);
    },
    emit: function(action, status, logs, inputs=[]){
        this.socket.emit('compiler', { action, status, logs, allowed: this.allowed[this.lang], inputs });
    }
};
