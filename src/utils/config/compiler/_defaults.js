module.exports = {
  "html": {
    language: "html",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "css": {
    language: "css",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "vanillajs": {
    language: "vanillajs",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "react": {
    language: "react",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "python3": {
    language: "python3",
    compiler: "python3",
    tester: "pytest",
    ignoreRegex: null,
    actions: ['run', 'test']
  },
  "node": {
    language: "node",
    compiler: "node",
    tester: "jest",
    ignoreRegex: null,
    actions: ['run', 'test']
  }
}
