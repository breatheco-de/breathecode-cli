module.exports = {
  "html": {
    port: 3000,
    address: "localhost",
    language: "html",
    compiler: "html",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    outputPath: './.breathecode/dist',
    publicPath: '/preview',
    actions: ['build', 'test']
  },
  "css": {
    port: 3000,
    address: "localhost",
    language: "css",
    compiler: "webpack",
    tester: "jest",
    outputPath: './.breathecode/dist',
    publicPath: '/preview',
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "vanillajs": {
    port: 3000,
    address: "localhost",
    language: "vanillajs",
    compiler: "webpack",
    tester: "jest",
    outputPath: './.breathecode/dist',
    publicPath: '/preview',
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "react": {
    port: 3000,
    address: "localhost",
    language: "react",
    compiler: "webpack",
    tester: "jest",
    outputPath: './.breathecode/dist',
    publicPath: '/preview',
    template: __dirname + '/template.html',
    ignoreRegex: null,
    actions: ['build', 'test']
  },
  "python3": {
    port: 3000,
    address: "localhost",
    language: "python3",
    compiler: "python3",
    tester: "pytest",
    ignoreRegex: null,
    actions: ['run', 'test']
  },
  "node": {
    port: 3000,
    address: "localhost",
    language: "node",
    compiler: "node",
    tester: "jest",
    ignoreRegex: null,
    actions: ['run', 'test']
  }
}
