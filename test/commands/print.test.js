const {expect, test} = require('@oclif/test')

describe('c9 scope', () => {
  test
  .stdout()
  .command(['print'])
  .it('runs: $ breathecode print', ctx => {
    expect(ctx.stdout).to.contain('$ npm run start')
  })
})
