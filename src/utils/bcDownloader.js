var fs = require('fs');
var targz = require('targz');
let Console = require('./console');
var http = require('http');
const request = require('request')
module.exports = function(url, dest) {

  const directoryPath = dest.substring(0, dest.lastIndexOf("/"));
  if (fs.existsSync(directoryPath+"/index.html")) {
    Console.info(`_app was already decompressed`);
    return;
  }

  if (fs.existsSync(dest)) {
    Console.info(`${dest} already exists, proceding to decompress`);
    return new Promise((resolve, reject) => decompress(dest, directoryPath).then(resolve).catch(err => {
      Console.error(err.message);
      reject(err);
    }));
  }

  if (!fs.existsSync(directoryPath)){
      Console.info("Creating directory "+directoryPath);
      fs.mkdirSync(directoryPath);
  }

  return new Promise((resolve, reject) => {

        const file = fs.createWriteStream(dest);
        request.get(url)
          .on('error', function(err) {
              fs.unlink(dest);
              return reject(err);
          })
          .pipe(file);

        // close() is async, call cb after close completes
        file.on('finish', () => {
          Console.info("Download finished, proceeding to decompress "+dest);
          decompress(dest, directoryPath).then(resolve).catch(reject);
        });

    });
};

const decompress = (sourcePath, destinationPath) => new Promise((resolve, reject) => {
    targz.decompress({
        src: sourcePath,
        dest: destinationPath
    }, function(err){
        if(err) {
            Console.error("Error when trying to decompress");
            reject(err);
        } else {
            Console.info("Decompression finished successfully");
            resolve();
        }
    });
});
