
const shared_defaults = {
  port: 3000,
  address: "https://localhost",
  editor: null,
  configPath: './learn.json',
  outputPath: './.learn/dist',
  publicPath: '/preview',
  grading: 'isolated',
  ignoreRegex: null,
  webpack_template: null, // if you want webpack to use an HTML template
  disable_grading: false,
  onCompilerSuccess: null,

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
    actions: ['build', 'test', 'reset'],
    onCompilerSuccess: "open-browser",
  },
  "css": {
    ...shared_defaults,
    language: "css",
    compiler: "webpack",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    actions: ['build', 'test', 'reset'],
    onCompilerSuccess: "open-browser",
  },
  "vanillajs": {
    ...shared_defaults,
    language: "vanillajs",
    compiler: "webpack",
    tester: "jest",
    actions: ['build', 'test', 'reset'],
    onCompilerSuccess: "open-browser",
  },
  "react": {
    ...shared_defaults,
    language: "react",
    compiler: "webpack",
    tester: "jest",
    webpack_template: __dirname + '/template.html',
    actions: ['build', 'test', 'reset'],
    onCompilerSuccess: "open-browser",
  },
  "python3": {
    ...shared_defaults,
    language: "python3",
    compiler: "python3",
    tester: "pytest",
    actions: ['run', 'test', 'reset']
  },
  "node": {
    ...shared_defaults,
    language: "node",
    compiler: "node",
    tester: "jest",
    actions: ['run', 'test', 'reset']
  },
  "java": {
    ...shared_defaults,
    language: "java",
    compiler: "java",
    tester: "junit",
    actions: ['run', 'test', 'reset']
  }
}
