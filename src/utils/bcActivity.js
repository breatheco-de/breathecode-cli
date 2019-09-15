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

          if(resp.status !== 200) Console.debug(`Error ${resp.status}: `, await resp.text());
        }
        catch(err){
          Console.error(err.message);
          console.debug(err);
        }

    },
    error: async function({ details, framework, language, message, name, builder }){
        const s = session.get();
        if(!s) return;

        try{
          let url = 'https://assets.breatheco.de/apis/activity';

          const resp = await fetch(url+'/core_error', {
            body: JSON.stringify({
              slug,
              username: s.email,
              severity: 0,
              details,
              builder,
              framework,
              language,
              message,
              name,
              user_agent: 'bc/cli',
              cohort: s.currentCohort.slug,
              day: s.currentCohort.current_day
            }),
            headers: { "Authorization": "JSW "+s.token },
            method: 'post'
          });

          if(resp.status !== 200) Console.debug(`Error ${resp.status}: `, await resp.text());
        }
        catch(err){
          Console.error(err.message);
          console.debug(err);
        }
    }
};
