const Console = require('./console');
const shell = require('shelljs')
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');

module.exports = {
    token: null,
    email: null,
    isActive: function(){
      if(this.token && this.email) return true;
      else return false;
    },
    login: async function(status, messages=[]){

        var email = readlineSync.question('Your email: ');
        var password = readlineSync.question('Password: ',{
          hideEchoBack: true // The typed text on screen is hidden by `*` (default).
        });

        let url = 'https://assets.breatheco.de/apis/credentials/auth';

        try{
          const resp = await fetch(url+'/auth', {
            body: JSON.parse({ email, password }),
            method: 'post'
          });
          const data = await resp.json();
          this.start({ token: data.assets_token, email: data.email });
        }
        catch(err){
          Console.error(err.message);
          console.error(err);
        }

    },
    sync: function(){
      if(process.env.BC_ASSETS_TOKEN && BC_STUDENT_EMAIL){
        session.start({
          token: process.env.BC_ASSETS_TOKEN,
          email: BC_STUDENT_EMAIL
        });
      }
    },
    start: function({ token, email}){
      if(!token && !email) throw new Error("A token and email is needed to start a session");

      if (shell.exec(`export BC_ASSETS_TOKEN="${token}" && export BC_STUDENT_EMAIL="${email}"`) !== 0){
        Console.error("There was an error starting the session");
        shell.exit(1)
      }
      else{
        this.token = token;
        this.email = email;
      }
    },
    destroy: function(){
      if (shell.exec(`unset BC_ASSETS_TOKEN && unset BC_STUDENT_EMAIL`) !== 0){
        Console.error("There was an error destroying the session");
        shell.exit(1)
      }
      else{
        this.token = token;
        this.email = email;
      }
    }
};
