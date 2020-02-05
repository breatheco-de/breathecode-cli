
shared_defaults = {
  port: 3000,
  address: "localhost",
  editor: "standalone",
  outputPath: './.breathecode/dist',
  publicPath: '/preview',
  grading: 'isolated',
  ignoreRegex: null,
  webpack_template: null, // if you want webpack to use an HTML template
  disable_grading: false,

  // Mandatory
  language: null,
  compiler: null,
  tester: null,
  actions: []
}

module.exports = {
  "html": {
    ...shared_defaults,
    language: "html",
    compiler: "html",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "css": {
    ...shared_defaults,
    language: "css",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test']
  },
  "vanillajs": {
    ...shared_defaults,
    language: "vanillajs",
    compiler: "webpack",
    tester: "jest",
    actions: ['build', 'test']
  },
  "react": {
    ...shared_defaults,
    language: "react",
    compiler: "webpack",
    tester: "jest",
    webpack_template: __dirname + '/template.html',
    actions: ['build', 'test']
  },
  "python3": {
    ...shared_defaults,
    language: "python3",
    compiler: "python3",
    tester: "pytest",
    actions: ['run', 'test']
  },
  "node": {
    ...shared_defaults,
    language: "node",
    compiler: "node",
    tester: "jest",
    actions: ['run', 'test']
  },
  "java": {
    ...shared_defaults,
    language: "java",
    compiler: "java",
    tester: "junit",
    actions: ['run', 'test']
  }
}
