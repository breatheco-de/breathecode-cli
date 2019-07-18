const prettier = require("prettier");
const fs = require("fs");
const path = require("path");
const parsers = {
  js: "babel",
  jsx: "babel",
  css: "css",
  sass: "sass",
  html: "html",
}

const DEFAULT_EXTENSIONS = prettier.getSupportInfo
  ? prettier
      .getSupportInfo()
      .languages.map(l => l.extensions)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue))
  : [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".css",
      ".less",
      ".scss",
      ".html",
      ".sass",
      ".graphql",
      ".json"
    ];

const DEFAULT_ENCODING = "utf-8";

const DEFAULT_CONFIG_FILE = `${process.cwd()}/.prettierrc`;

module.exports = class PrettierPlugin {
  constructor(options) {
    options = options || {};

    // Encoding to use when reading / writing files
    this.encoding = options.encoding || DEFAULT_ENCODING;
    delete options.encoding;

    // Only process these files
    this.extensions = options.extensions || DEFAULT_EXTENSIONS;
    delete options.extensions;

    // Ignore particular files
    this.exclude = options.exclude || [];
    delete options.exclude;

    // Utilize this config file for options
    this.configFile = options.configFile || DEFAULT_CONFIG_FILE;
    delete options.configFile;

    // Resolve the config options from file to an object
    const configOptions = prettier.resolveConfig.sync(this.configFile) || {};

    // Override Prettier options from config if any are specified
    this.prettierOptions = Object.assign(configOptions, options);

  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('Prettier', (compilation, callback) => {
      const promises = [];
      compilation.fileDependencies.forEach(filepath => {

        let fileExtension = path.extname(filepath);
        if (this.extensions.indexOf(fileExtension) === -1 || this.exclude.find(reg => RegExp(reg).test(filepath))) {
          return;
        }
        fileExtension = fileExtension.substr(1);

        if (/node_modules/.exec(filepath)) {
          return;
        }

        if(typeof parsers[fileExtension] === 'undefined') throw Error('Uknown extension .'+fileExtension);

        promises.push(new Promise((resolve, reject) => {
          fs.readFile(filepath, this.encoding, (err, source) => {
            if (err) {
                return reject(err);
            }

            try{
              const prettierSource = prettier.format(source, Object.assign({ parser: parsers[fileExtension] }, this.prettierOptions, { filepath }));
              if (prettierSource !== source) {
                fs.writeFile(filepath, prettierSource, this.encoding, err => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                });
              } else {
                resolve();
              }
            }
            catch(err){
              return reject(err);
            }
          });
        }));
      });

      Promise.all(promises).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    });
  }
};
