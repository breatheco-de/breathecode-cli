const poly = require('@babel/polyfill');

module.exports = async (something) => {

  global.window = {};
  window.prompt = () => null;

  const configIndex = process.argv.indexOf('--config');
  if(configIndex > -1){
    const config = JSON.parse(process.argv[configIndex+1]);
    if(config && config.globals){
      const stdin = [].concat(config.globals.__stdin);
      global.window = {};
      global.prompt = window.prompt = () => stdin.shift();
    }

  }

};
