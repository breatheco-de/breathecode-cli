# Creating exercises using the BreatheCode CLI

## About the BC.json

```json
{
    port: 3000,
    address: "localhost",
    language: "html",
    compiler: "html",
    tester: "jest",
    ignoreRegex: /.*\.js/gm,
    outputPath: './.breathecode/dist',
    publicPath: '/preview',
    actions: ['build', 'test']
}

```
