var shell = require('shelljs')
 
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

if (shell.exec('git clone https://github.com/4GeeksAcademy/react-hello.git').code !== 0) {
  shell.echo('Error: Git commit failed')
  shell.exit(1)
}


if (shell.exec('rm -R -f ./react-hello/.git').code !== 0) {
  shell.echo('Error: removing .git directory')
  shell.exit(1)
}

