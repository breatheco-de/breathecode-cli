
let connect = require('socket.io');
let Console = require('./console');

module.exports = {
    socket: null,
    config: null,
    allowedActions: null,
    actionCallBacks: {
        clean: (data, s) => {
            s.logs = [];
        }
    },
    addAllowed: function(action){
        this.allowedActions.push(action);
    },
    removeAllowed: function(action){
        this.allowedActions = this.allowedActions.filter(a => a !== action);
    },
    start: function(config, server){
        this.config = config;
        this.allowedActions = config.actions;
        this.socket = connect(server);
        this.socket.on('connection', (socket) => {
          Console.debug("Connection with client successfully established");
          this.log('ready',['Ready to compile or test...']);

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
    log: function(status, messages=[],report=[]){
      this.emit('log',status,messages,[],report);
    },
    emit: function(action, status='ready', logs=[], inputs=[], report=[]){

      if(['webpack','vanillajs','vue', 'react', 'css', 'html'].includes(this.config.compiler)){
        if(['compiler-success', 'compiler-warning'].includes(status)) this.addAllowed('preview');
        if(['compiler-error'].includes(status) || action == 'ready') this.removeAllowed('preview');
      }

      if(this.config.grading === 'incremental') this.removeAllowed('run');

      this.socket.emit('compiler', { action, status, logs, allowed: this.allowedActions, inputs, report });
    }
};
