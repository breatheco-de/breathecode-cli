const Console = require('./console');
const shell = require('shelljs')
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const v = require('validator');
const { ValidationError } = require('./errors');
const moment = require('moment');

module.exports = {
    token: null,
    email: null,
    currentCohort: { slug: null, current_day: null },
    setPayload(value){
      const payload = Buffer.from(JSON.stringify(value)).toString('base64');
      shell.env["BC_PAYLOAD"] = payload;
      return true;
    },
    getPayload(){
      if(shell.env["BC_PAYLOAD"]) return JSON.parse(Buffer.from(shell.env["BC_PAYLOAD"], 'base64').toString('ascii'));
      else return null;
    },
    isActive: function(){
      if(this.token && this.email) return true;
      else return false;
    },
    get: async function(){
      await this.sync();
      if(!this.isActive()) return null;
      return {
        token: this.token,
        email: this.email,
        currentCohort: this.currentCohort,
        payload: this.getPayload()
      };
    },
    login: async function(){

        try{
          var email = readlineSync.question('Your email: ');
          if(!v.isEmail(email)) throw new ValidationError('Invalid email');

          var password = readlineSync.question('Password: ',{
            hideEchoBack: true // The typed text on screen is hidden by `*` (default).
          });

          let url = 'https://assets.breatheco.de/apis/credentials';
          const resp = await fetch(url+'/auth', {
            body: JSON.stringify({ username: email, password, user_agent: 'bc/cli' }),
            method: 'post'
          });
          if(resp.status === 200){
            const data = await resp.json();

            const currentCohorts = data.full_cohorts.filter(c => {
                return moment().isBetween(c['kickoff_date'], c['ending_date']);
            });

            this.currentCohort = currentCohorts.length === 1 ? currentCohorts[0] : currentCohorts.length > 1 ? currentCohorts.pop() : null;

            this.start({ token: data.assets_token, email: data.email, payload: data });
          }
          else if(resp.status === 400){
            const error = await resp.json();
            Console.info(error.msg);
          }
          else Console.debug(`Error ${resp.status}: `, await resp.json().msg);
        }
        catch(err){
          Console.error(err.message);
          Console.debug(err);
        }

    },
    sync: async function(){
      if(shell.env["BC_ASSETS_TOKEN"] && shell.env["BC_STUDENT_EMAIL"]){
        this.start({ token: shell.env["BC_ASSETS_TOKEN"], email: shell.env["BC_STUDENT_EMAIL"] });
        if(!this.getPayload()){

          let url = 'https://assets.breatheco.de/apis/credentials';
          const resp = await fetch(url+`/me?access_token=${this.token}`);
          if(resp.status === 200){
            const data = await resp.json();

            const currentCohorts = data.full_cohorts.filter(c => {
                return moment().isBetween(c['kickoff_date'], c['ending_date']);
            });
            this.currentCohort = currentCohorts.length === 1 ? currentCohorts[0] : currentCohorts.length > 1 ? currentCohorts.pop() : null;
            this.setPayload(data);
          }
          else if(resp.status === 400){
            const error = await resp.json();
            Console.info(error.msg);
          }
          else Console.debug(`Error ${resp.status}: `, await resp.text());

        }
      }
    },
    start: function({ token, email, payload=null }){
      if(!token && !email) throw new Error("A token and email is needed to start a session");

      shell.env["BC_ASSETS_TOKEN"] = token;
      shell.env["BC_STUDENT_EMAIL"] = email;
      this.token = token;
      this.email = email;
      if(payload) this.setPayload(payload);

      Console.success(`Hello ${this.email} you have successfully logged in.`);
    },
    destroy: function(){
      if (shell.exec(`unset BC_ASSETS_TOKEN && unset BC_STUDENT_EMAIL && unset BC_PAYLOAD`).code !== 0){
        Console.error("There was an error destroying the session");
        shell.exit(1)
      }
      else{
        this.token = token;
        this.email = email;
        this.currentCohort = { slug: null, current_day: null };
      }
    }
};
