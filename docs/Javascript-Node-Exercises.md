

1. How many times a function is called


# 1) How many times a function is called
```js
// mock the function
let _buffer = "";
global.console.log = console.log = jest.fn((text) => _buffer += text + "\n");

it('console.log() function should have been called 2 times', function () {
    //then I import the index.js (which should have the alert() call inside)
    const file = require("./app.js");
    expect(console.log.mock.calls.length).toBe(2);
});
```

## 2) A particular string has been printed on the console
```js
it('Print the 1st item on the array (position 2)', function () {
    //You can also compare the entire console buffer (if there have been several console.log calls on the exercise)
    expect(_buffer.includes("4\n")).toBe(true);
});
```

## 3) That a function has been called with specific parameter

```js
it('Call the function with Hello world', function () {
  expect(console.log).toHaveBeenCalledWith("Hello World");
 });
```

