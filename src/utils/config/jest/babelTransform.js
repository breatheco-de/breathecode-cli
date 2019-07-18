'use strict';

const babelJest = require('babel-jest');
const path = require('path');
const nodeModulesPath = path.resolve(__dirname, '../../../../node_modules');
const env = nodeModulesPath+'/@babel/preset-env';
const react = nodeModulesPath+'/@babel/preset-react';

module.exports = babelJest.createTransformer({
  presets: [ env, react ],
  babelrc: false,
  configFile: false,
});