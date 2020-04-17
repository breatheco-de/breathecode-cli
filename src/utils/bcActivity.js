const Console = require('./console');
const fetch = require('node-fetch');
const session = require('./bcSession.js');
module.exports = {
    activity: async function(slug, data=null){

        const s = await session.get();
        if(!s) return;

        try{
          if (!slug || slug==="") throw Error("Empty slug for tracking activity");
          else Console.debug(`Tracking activity slug: "${slug}"`);

          let url = 'https://assets.breatheco.de/apis/activity';

          const { email } = s.payload;

          const _body = {
            slug, user_agent: 'bc/cli',
            cohort: s.currentCohort.slug,
            day: s.currentCohort.current_day,
            data: JSON.stringify(data)
          };
          const resp = await fetch(url+'/user/'+email, {
            body: JSON.stringify(_body),
            headers: { "Authorization": "JWT "+s.token,  "Content-Type": "Application/JSON" },
            method: 'post'
          });

          if(resp.status != 200) Console.debug(`Error ${resp.status}: `, await resp.text());
          else Console.debug(`Activity registered successfully  ${slug}`, await resp.text());
        }
        catch(err){
          Console.error(err.message);
          //console.error(err);
        }

    },
    error: async function(slug, { details, framework, language, message, name, compiler, data }){
        const s = await session.get();
        if(!s || !s.payload) return;

        try{
          let url = 'https://assets.breatheco.de/apis/activity';


          let _message = !Array.isArray(message) ? message : message.join("\n");
          //remove colors ASCII
          _message = _message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'');
          _message = _message.length > 1000 ? _message.substring(_message.length - 1001, _message.length) : _message;

          const body = {
              slug,
              username: s.payload.email,
              severity: 0,
              details,
              builder: compiler,
              framework,
              language,
              message: _message,
              name,
              data,
              user_agent: 'bc/cli',
              cohort: s.currentCohort.slug,
              day: s.currentCohort.current_day
            };
          const resp = await fetch(url+'/coding_error', {
            body: JSON.stringify(body),
            headers: { "Authorization": "JWT "+s.token,  "Content-Type": "Application/JSON" },
            method: 'post'
          });

          if(resp.status != 200) Console.debug(`Error ${resp.status}: `, await resp.text());
          else Console.debug(`Activity tracked: ${language} -> ${name} for ${s.payload.email}`);
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
