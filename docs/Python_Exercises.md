# Grading Exercises in Python

0. Use the print function
1. Testing content of the file.
2. Testing function of variable declarations.
2. Testing function of global variable value
4. Testing `print` (stdout) for the entire application
5. Testing console output (stdout) for just one function.
6. Testing `input` (stdin)

### 0) Find a particular exact string on the file
```py
@pytest.mark.it("Use the print function")
def test_output():
    f = open(os.path.dirname(os.path.abspath(__file__)) + '/app.py')
    content = f.read()
    assert content.find("print(") > 0
```

### 1) Testing that the student solution contains a particular regex or string
```py
@pytest.mark.it("1. Create a variable named 'color' with the string value red")
def test_declare_variable():
    path = os.path.dirname(os.path.abspath(__file__))+'/app.py'
    with open(path, 'r') as content_file:
        content = content_file.read()
        regex = re.compile(r"color(\s*)=(\s*)\"red\"")
        assert bool(regex.search(content)) == True
```

### 2) Testing Function or variable declaration (existance) in Python
```py
@pytest.mark.it('1. You should create a variable named variables_are_cool')
def test_variable_exists(app):
    try:
        app.variables_are_cool
    except AttributeError:
        raise AttributeError("The variable 'variables_are_cool' should exist on app.py")
```

### 3) Testing Function or variable value
```py
@pytest.mark.it('1. You should create a variable named myVariable with the value "Hello"')
def test_variable_exists(app):
    try:
        assert app.myVariable == "Hello"
    except AttributeError:
        raise AttributeError("The variable 'myVariable' should have the variable Hello")
```

### 4) Testing a print (stdout) in the entire app.py
```py
import io
import sys

@pytest.mark.it('3. The printed value on the console should be "red"')
def test_for_file_output(capsys, app):
    app()
    captured = capsys.readouterr()
    assert "red\n" == captured.out
```

### 5) Testing console output (stdout) for just one function.  

```py
@pytest.mark.it('The console should output "Hello" inside the function printHello ')
def test_for_file_output(capsys, app):
    app.printHello()
    captured = capsys.readouterr()
    assert captured.out == "Hello\n"
```

### 6) Testing stdin (using input function) in Python

```py
import pytest, io, sys, json

@pytest.mark.it('Sum all three input numbers and print on the console the result')
def test_add_variables(capsys):

    fake_input = [2,3,4] #fake input
    with mock.patch('builtins.input', lambda x: fake_input.pop()):
      captured = capsys.readouterr()
      assert captured.out == "9\n"
```
