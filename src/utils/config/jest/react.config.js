
const path = require('path');
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../../../node_modules');
const babelTransformPath = require.resolve('./babelTransform.js');

if (!fs.existsSync(nodeModulesPath+'/prettier')){
  console.error(`Uknown prettier path`);
  return;
}
else console.log('Using prettier from '+nodeModulesPath+'/prettier');

module.exports = {
    verbose: true,
    moduleDirectories: [nodeModulesPath],
    prettierPath: nodeModulesPath+'/prettier',
    transform: {
      "^.+\\.js?$": babelTransformPath
    }
};
