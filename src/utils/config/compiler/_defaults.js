module.exports = {
  "html": {
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "css": {
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "vanillajs": {
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "react": {
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "python3": {
    compiler: "python3",
    tester: "pytest",
    ignoreRegex: null,
    actions: ['run', 'test']
  },
  "node": {
    compiler: "node",
    tester: "jest",
    ignoreRegex: null,
    actions: ['run', 'test']
  }
}
