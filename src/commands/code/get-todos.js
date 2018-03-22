const {Command, flags} = require('@oclif/command')
let BashScripts = require('../../utils/bash/index')
let Console = require('../../utils/console')
class SingleCommand extends Command {
  async run() {
    const {flags} = this.parse(SingleCommand)
    Console.info(`Parsing project for TODOs...`)
    BashScripts.execute('get-todos',flags)
  }
}
SingleCommand.description = 'Reads your code looking for //TODO: comments'
SingleCommand.flags = {
 log: flags.boolean({char:'l', default:false, description: 'log scaned files on the console'}),
 type: flags.string({char:'t', default:'js', description: 'file extensions to look for', options: ['js', 'jsx', 'scss', 'css', 'md', 'html', 'py']})
}
module.exports = SingleCommand
