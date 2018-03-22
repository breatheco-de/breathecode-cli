const {expect, test} = require('@oclif/test')

describe('c9 scope', () => {
  test
  .stdout()
  .command(['generate:all'])
  .it('runs -> generate:all', ctx => {
    expect(ctx.stdout).to.contain('breathecode generate help')
  })
})