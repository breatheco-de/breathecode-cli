var fs = require('fs');

// Returns a buffer of the exact size of the input.
// When endByte is read, stop reading from stdin.
function getStdin(endByte) {
  var BUFSIZE = 256;
  var buf = new Buffer.alloc(BUFSIZE);
  var totalBuf = new Buffer.alloc(BUFSIZE);
  var totalBytesRead = 0;
  var bytesRead = 0;
  var endByteRead = false;

  var fd = process.stdin.fd;
  // Linux and Mac cannot use process.stdin.fd (which isn't set up as sync).
  var usingDevice = false;
  try {
    fd = fs.openSync('/dev/stdin', 'rs');
    usingDevice = true;
  } catch (e) {}

  for (;;) {
    try {
      bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);

      // Copy the new bytes to totalBuf.
      var tmpBuf = new Buffer.alloc(totalBytesRead + bytesRead);
      totalBuf.copy(tmpBuf, 0, 0, totalBytesRead);
      buf.copy(tmpBuf, totalBytesRead, 0, bytesRead);
      totalBuf = tmpBuf;
      totalBytesRead += bytesRead;

      // Has the endByte been read?
      for (var i = 0; i < bytesRead; i++) {
        if (buf[i] === endByte) {
          endByteRead = true;
          break;
        }
      }
      if (endByteRead) { break; }
    } catch (e) {
      if (e.code === 'EOF') { break; }
      throw e;
    }
    if (bytesRead === 0) { break; }
  }
  if (usingDevice) { fs.closeSync(fd); }
  return totalBuf;
}
var stdin = '';

function prompt() {
  if (stdin.length === 0) {
    stdin = getStdin('\n'.charCodeAt(0)).toString('utf-8');
  }
  var newline = stdin.search('\n') + 1;
  var line = stdin.slice(0, newline);
  // Flush
  stdin = stdin.slice(newline);
  return line;
}
