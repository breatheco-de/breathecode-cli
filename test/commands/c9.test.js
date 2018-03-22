const {expect, test} = require('@oclif/test')

describe('c9 scope', () => {
  test
  .stdout()
  .command(['c9:all'])
  .it('runs -> c9:all help', ctx => {
    expect(ctx.stdout).to.contain('breathecode c9 help')
  })
})