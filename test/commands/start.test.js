const {expect, test} = require('@oclif/test')

describe('c9 scope', () => {
  test
  .stdout()
  .command(['start:all'])
  .it('runs: $ start:all help', ctx => {
    expect(ctx.stdout).to.contain('breathecode start help')
  })
})