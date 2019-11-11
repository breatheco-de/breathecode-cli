const {expect, test} = require('@oclif/test')

describe('create new exercises', () => {
  test
  .stdout()
  .command(['create:exercises'])
  .it('runs: $ bc create:exercises', ctx => {
    expect(ctx.stdout).to.contain('Pick a language')
  })
  // TODO: write more advanced tests for the code command.
})
