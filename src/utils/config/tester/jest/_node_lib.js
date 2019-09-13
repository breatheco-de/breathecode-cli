import '@babel/polyfill';

module.exports = async () => {
  global.prompt = () => null;
};
