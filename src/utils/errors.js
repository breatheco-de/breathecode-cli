const fetch = require("node-fetch");
const Console = require("./console");
let solutions = null;
const uknown = { video: "https://www.youtube.com/watch?v=gD1Sa99GiE4", message: "Uknown internal error", slug: "uknown", gif: "https://github.com/breatheco-de/breathecode-cli/blob/master/docs/errors/uknown.gif?raw=true" };
const getSolution = (slug=null) => {
  Console.debug(`Getting solution for ${slug}`, solutions);
  if(!solutions){
    Console.debug("Fetching for errors.json on github");
    fetch('https://raw.githubusercontent.com/breatheco-de/breathecode-cli/master/docs/errors/errors.json')
      .then(r => r.json()).then(_s => solutions = _s);
    return uknown;
  }
  if(typeof solutions[slug] === "undefined" || !slug) return uknown;
  else return solutions[slug];
}
const ValidationError = (error) => {
  const message = error.message || error;
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'validation-error';

  const sol = getSolution(error.slug);
  _err.video = sol.video;
  _err.gif = sol.gif;
  _err.message = typeof message === "string" ? message : sol.message;
  return _err;
}
const NotFoundError = (error) => {
  const message = error.message || error;
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'not-found-error';

  const sol = getSolution(error.slug);
  _err.video = sol.video;
  _err.gif = sol.gif;
  _err.message = typeof message === "string" ? message : sol.message;
  return _err;
}
const CompilerError = (error) => {
  const message = error.message || error;
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'compiler-error';

  const sol = getSolution(error.slug);
  _err.video = sol.video;
  _err.gif = sol.gif;
  _err.message = typeof message === "string" ? message : sol.message;
  return _err;
}
const TestingError = (error) => {
  const message = error.message || error;
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'testing-error';
  return _err;
}
const InternalError = (error) => {
  const message = error.message || error;
  const _err = new Error(message);
  _err.status = 500;
  _err.type = 'internal-error';

  const sol = getSolution(error.slug);
  _err.video = sol.video;
  _err.gif = sol.gif;
  _err.message = typeof message === "string" ? message : sol.message;
  return _err;
}

getSolution();
module.exports = { ValidationError, CompilerError, TestingError, NotFoundError, InternalError };
