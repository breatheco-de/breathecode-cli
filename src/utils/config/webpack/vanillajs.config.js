const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const highlight = require('rehype-highlight');

const prettyConfig = require('../prettier/vanillajs.config.js');
const PrettierPlugin = require("../prettier/plugin.js");

const nodeModulesPath = path.resolve(__dirname, '../../../../node_modules');

module.exports = {
  mode: "development",
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  nodeModulesPath+'/@babel/preset-env',
                ],
                plugins:[
                  require(nodeModulesPath+'/babel-plugin-syntax-dynamic-import')
                ]
              }
            },
            {
                loader: 'eslint-loader',
                options: {
                  configFile: path.resolve(__dirname,'../eslint/vanillajs.lint.json')
                }
            }
          ]
        },
        { test: /\.md$/, use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  nodeModulesPath+'/babel-preset-env',
                ]
              }
            },
            {
              loader: '@hugmanrique/react-markdown-loader',
              options: {
                rehypePlugins: [
                  highlight
                ]
              }
            }
          ]
        },
        {
          test: /\.(css|scss)$/, use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        }, //css only files
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/, use: {
            loader: 'file-loader',
            options: { name: '[name].[ext]' }
          }
        }, //for images
        { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: ['file-loader'] } //for fonts
    ]
  },
  resolve: {
    extensions: ['*', '.js'],
    modules: [nodeModulesPath]
  },
  resolveLoader: {
    modules: [nodeModulesPath]
  },
  devtool: "source-map",
  devServer: {
    contentBase:  './dist',
    quiet: false,
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new PrettierPlugin(prettyConfig)
  ]
};
