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
    payload: null,
    isActive: function(){
      if(this.token && this.email) return true;
      else return false;
    },
    get: function(){
      if(!this.isActive()) return null;
      return {
        token: this.token,
        email: this.email,
        currentCohort: this.currentCohort,
        payload: this.payload
      }
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
            const current = currentCohorts.length === 1 ? currentCohorts[0] : currentCohorts.length > 1 ? currentCohorts.pop() : null;
            this.start({ token: data.assets_token, email: data.email, currentCohort: current, payload: data });
          }
          else if(resp.status === 400){
            const error = await resp.json();
            Console.info(error.msg);
          }
          else Console.debug(`Error ${resp.status}: `, await resp.text());
        }
        catch(err){
          Console.error(err.message);
          console.debug(err);
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
    start: function({ token, email, payload }){
      if(!token && !email) throw new Error("A token and email is needed to start a session");

      if (shell.exec(`export BC_ASSETS_TOKEN="${token}" && export BC_STUDENT_EMAIL="${email}"`).code !== 0){
        Console.error("There was an error starting the session");
        shell.exit(1)
      }
      else{
        this.token = token;
        this.email = email;
        this.payload = payload || null;
        Console.success(`Hello ${this.email} you have successfully logged in.`);
      }
    },
    destroy: function(){
      if (shell.exec(`unset BC_ASSETS_TOKEN && unset BC_STUDENT_EMAIL`).code !== 0){
        Console.error("There was an error destroying the session");
        shell.exit(1)
      }
      else{
        this.token = token;
        this.email = email;
      }
    }
};
