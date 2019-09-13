const Console = require('./console');
const shell = require('shelljs')
const fetch = require('fetch');

module.exports = {
    token: null,
    email: null,
    login: async function(status, messages=[]){
        let url = 'https://assets.breatheco.de/apis/credentials/auth';
        return fetch(url+'/auth', {
          body: JSON.parse({ username, password }),
          method: 'post'
        }).then(resp => resp.json())
        .then(data => this.start({ token: data.assets_token, email: data.email }))
        .catch(err => {
          Console.error(err.message);
          console.error(err);
        });
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
