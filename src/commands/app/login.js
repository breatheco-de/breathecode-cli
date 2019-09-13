const {Command, flags} = require('@oclif/command');

let bcSession = require('../bcSession')
let Console = require('../utils/console')
class SingleCommand extends Command {
  async run() {
    const { flags } = this.parse(SingleCommand);

    if(process.env.BC_ASSETS_TOKEN && process.env.BC_STUDENT_EMAIL){
      Console.info(`You are already logged in with ${process.env.BC_STUDENT_EMAIL}`);
    }
    else{
      bcSession.login();
    }

  }
}
SingleCommand.description = 'Login to breathecode'
SingleCommand.flags = {
 log: flags.boolean({char:'l', default:false, description: 'log scaned files on the console'}),
 type: flags.string({char:'t', default:'js', description: 'file extensions to look for', options: ['js', 'jsx', 'scss', 'css', 'md', 'html', 'py']})
}
module.exports = SingleCommand
