const {Command, flags} = require('@oclif/command');
let Console = require('../utils/console')
let session = require('../utils/bcSession')
class SingleCommand extends Command {
  async run() {
    const { flags } = this.parse(SingleCommand);

    if(session.isActive()){
      Console.success(`You are already logged in with ${process.env.BC_STUDENT_EMAIL}`);
    }
    else{
      session.login();
    }

  }
}
SingleCommand.description = 'Login to breathecode'
SingleCommand.flags = {
 log: flags.boolean({char:'l', default:false, description: 'log scaned files on the console'}),
 type: flags.string({char:'t', default:'js', description: 'file extensions to look for', options: ['js', 'jsx', 'scss', 'css', 'md', 'html', 'py']})
}
module.exports = SingleCommand
