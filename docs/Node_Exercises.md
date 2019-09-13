## Grading Exercises in Node

### Testing Function or variable declaration (existance) in Node
```js
    const app = rewire('./app.js');
    const total = app.__get__('total');
    expect(total).toBe(3434);
```
![Testing Function or variable declaration in Node](https://ucarecdn.com/c7e1835e-07a9-49e8-8e20-9a1a0c47a262/testing_function_declaration.jpg)

### Testing Function or variable call in Node
![Testing Function call in Node](https://ucarecdn.com/4e338df2-80d3-4534-a5ed-8cb210e7fa60/testing_function_execution.jpg)

### Testing Stdout (console.log) in Node

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

![Testing Stdin in Node](https://ucarecdn.com/1da6ad7f-0cfd-41af-a6c3-ae8aa50f48e8/testing_stdin_with_prompt.jpg)


