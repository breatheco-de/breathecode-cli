const Console = require('./console');
const shell = require('shelljs')
const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const v = require('validator');
const { ValidationError, InternalError } = require('./errors');
const moment = require('moment');
const fs = require('fs');
const storage = require('node-persist');

module.exports = {
    sessionStarted: false,
    token: null,
    currentCohort: null,
    initialize: async function(){
      if(!this.sessionStarted){
        if(fs.existsSync('.learn')) await storage.init({ dir: '.learn/.session' });
        else if(fs.existsSync('.breathecode')) await storage.init({ dir: '.breathecode/.session' });
        else throw InternalError('.learn configuration folder not found');
        this.sessionStarted = true;
      }
      return true
    },
    setPayload: async function(value){
      await this.initialize();
      await storage.setItem('bc-payload', { assets_token: this.token, ...value });
      Console.debug("Payload successfuly found and set for "+value.email);
      return true;
    },
    getPayload: async function(){
      await this.initialize();
      let payload = null;
      try{
         payload = await storage.getItem('bc-payload');
      }
      catch(err){
        Console.debug("Error retriving session payload");
      }
      return payload;
    },
    isActive: function(){
      if(this.token) return true;
      else return false;
    },
    get: async function(){
      await this.sync();
      if(!this.isActive()) return null;

      const payload = await this.getPayload();
      return {
        payload, token: this.token,
        currentCohort: this.getCurrentCohort(payload),
      };
    },
    getCurrentCohort: function(data){
        if(this.currentCohort) return this.currentCohort;

        const currentCohorts = data.full_cohorts.filter(c => {
            return moment().isBetween(c['kickoff_date'], c['ending_date']);
        });

        this.currentCohort = currentCohorts.length === 1 ? currentCohorts[0] :
          currentCohorts.length > 1 ? currentCohorts.pop() :
            data.full_cohorts.length > 1 ? currentCohorts.pop() : null;

        return this.currentCohort;
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
            this.currentCohort = this.getCurrentCohort(data);

            this.start({ token: data.assets_token, payload: data });
          }
          else if(resp.status >= 400){
            const error = await resp.json();
            if(error.msg){
              let m = /\{"code":(\d{3}),"msg":"(.*)"\}/gm.exec(error.msg);
              if(m) Console.error(m[2]);
              else{
                let m = /"error_description":"(.*)"/gm.exec(error.msg);
                if(m) Console.error(m[1]);
                else{
                  Console.error('Uknown Error');
                  Console.debug(error.msg);
                }
              }
            }
            else Console.error(error.error_description || error.message || error);
          }
          else Console.debug(`Error ${resp.status}: `, await resp.json().msg);
        }
        catch(err){
          Console.error(err.message);
          Console.debug(err);
        }

    },
    sync: async function(){
      const payload = await this.getPayload();
      if(payload) this.token = payload.assets_token;
      else if(shell.env["BC_ASSETS_TOKEN"]){
          this.token = shell.env["BC_ASSETS_TOKEN"];
          Console.debug("Retriving student information from API...");
          let url = 'https://assets.breatheco.de/apis/credentials';
          const resp = await fetch(url+`/me?access_token=${this.token}`);
          if(resp.status === 200){
            const data = await resp.json();

            this.currentCohort = this.getCurrentCohort(data);
            await this.setPayload(data);
          }
          else if(resp.status === 400){
            const error = await resp.json();
            Console.info(error.msg);
          }
          else Console.debug(`Error ${resp.status}: `, await resp.text());
      }
    },
    start: async function({ token, payload=null }){
      if(!token) throw new Error("A token and email is needed to start a session");
      shell.env["BC_ASSETS_TOKEN"] = token;
      this.token = token;
      if(payload) if(await this.setPayload(payload)) Console.success(`Successfully logged in as ${payload.email}`);
    },
    destroy: async function(){
        shell.env["BC_ASSETS_TOKEN"] = null;
        await storage.clear();
        this.token = token;
        this.currentCohort = { slug: null, current_day: null };
        Console.success('You have logged out');
    }
};
