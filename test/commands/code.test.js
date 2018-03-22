const {expect, test} = require('@oclif/test')

describe('c9 scope', () => {
  test
  .stdout()
  .command(['code:all'])
  .it('runs: $ code:all help', ctx => {
    expect(ctx.stdout).to.contain('breathecode code help')
  })
  // TODO: write more advanced tests for the code command.
})