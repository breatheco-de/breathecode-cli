const Console = require('./console');
const fetch = require('node-fetch');
const session = require('./bcSession.js');
module.exports = {
    activity: async function(slug, data=null){

        const s = session.get();
        if(!s) return;

        try{
          let url = 'https://assets.breatheco.de/apis/activity';

          const resp = await fetch(url+'/user/'+s.email, {
            body: JSON.stringify({ slug, user_agent: 'bc/cli', cohort: s.currentCohort.slug, day: s.currentCohort.current_day, data: JSON.stringify(data) }),
            headers: { "Authorization": "JSW "+s.token },
            method: 'post'
          });

          if(resp.status != 200) Console.debug(`Error ${resp.status}: `, await resp.text());
        }
        catch(err){
          Console.error(err.message);
          console.debug(err);
        }

    },
    error: async function(slug, { details, framework, language, message, name, builder, data }){
        const s = await session.get();
        if(!s || !s.payload) return;

        try{
          let url = 'https://assets.breatheco.de/apis/activity';

          const body = {
              slug,
              username: s.payload.email,
              severity: 0,
              details,
              builder,
              framework,
              language,
              message,
              name,
              data,
              user_agent: 'bc/cli',
              cohort: s.currentCohort.slug,
              day: s.currentCohort.current_day
            };
          const resp = await fetch(url+'/coding_error', {
            body: JSON.stringify(body),
            headers: { "Authorization": "JSW "+s.token,  "Content-Type": "Application/JSON" },
            method: 'post'
          });

          if(resp.status != 200) Console.debug(`Error ${resp.status}: `, await resp.text());
          else Console.debug(`Saving coding error ${language} -> ${name} for ${s.payload.email}`);
        }
        catch(err){
          Console.error(err.message);
          Console.debug(err);
        }
    },
    getPythonError(trace){
      const regex = /\^\\n(.*Error:\s.*)\\/gm;
      const matches = regex.exec(trace.toString());
      if(!matches){
        //Console.debug("Uknown error reported");
        return "Uknown Error";
      }
      return `${matches[1]}: ${matches[2]}`;
    }
};
