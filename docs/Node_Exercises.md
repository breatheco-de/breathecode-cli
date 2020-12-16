## Grading Exercises in Node

### Testing Function or variable declaration (existance) in Node
```js
    const app = rewire('./app.js');
    const total = app.__get__('total');
    expect(typeof(total)).not.toBe('undefined');
```

### Testing Function or variable specific value in Node
```js
    const app = rewire('./app.js');
    const total = app.__get__('total');
    expect(total).toBe(3434);
```

### Testing Function or variable call in Node
```js
    const app = rewire('./app.js');
    const sum = app.__get__('sum');
    expect(sum).toBeHaveBeenCalled(3434);
```

### Testing Stdout (console.log) call with particular value

```js
  //mock the console log
  global.console.log = console.log = jest.fn(text => null);

  //execute the module
  const app = require('./app.js');

  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith("Hello World");
```
![Testing Stdout in Python](https://ucarecdn.com/f585299b-edc6-4418-8826-d796a7d733aa/testing_stdout_node.png)

### Testing Stdin (prompt) in Node

```js
//mock the prompt function
const stdin = [].concat(__stdin);
//this mock will pass one by one all the inputs
global.prompt = jest.fn(() => __stdin.shift());

// we can test the prompt function received an input "hello"
expect(global.prompt).toHaveBeenCalledWith("Hello");
```



