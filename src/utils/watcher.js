const chokidar = require('chokidar');
const debounce = require('debounce');

module.exports = (path) => new Promise((resolve, reject) => {
  const watcher = chokidar.watch(path, {
    ignored: (_path, _stats) => {
      return _stats && !_stats.isDirectory();
    },
    persistent: true,
    depth: 1,
    ignoreInitial: true
  });

  const onChange = (eventname, filename) =>{
    resolve(eventname, filename);
  }
  watcher.on('all', debounce(onChange, 500, true));
  // watcher.on('all', onChange);

  process.on('SIGINT', function() {
      watcher.close();
      process.exit();
  });
});
