const ValidationError = (message) => {
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'validation-error';
  return _err;
}
const NotFoundError = (message) => {
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'not-found-error';
  return _err;
}
const CompilerError = (message) => {
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'compiler-error';
  return _err;
}
const TestingError = (message) => {
  const _err = new Error(message);
  _err.status = 400;
  _err.type = 'testing-error';
  return _err;
}

module.exports = { ValidationError, CompilerError, TestingError, NotFoundError };
