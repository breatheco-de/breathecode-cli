# Grading Exercises in Python

1. Testing content of the file.
2. Testing function of variable declarations.
2. Testing function of global variable value
4. Testing `print` (stdout) for the entire application
5. Testing console output (stdout) for just one function.
6. Testing `input` (stdin)

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
        app.myVariable
    except AttributeError:
        raise AttributeError("The variable 'myVariable' should exist on app.py")
```
![Testing Functions in Python](https://ucarecdn.com/ab3f9bbd-beff-492e-ad37-3be3fba18cfe/testingfunctionspythonbreathecodecli.jpg)

### 3) Testing Function or variable value
```py
@pytest.mark.it('1. You should create a variable named variables_are_cool')
def test_variable_exists(app):
    try:
        assert app.myVariable == "Hello"
    except AttributeError:
        raise AttributeError("The variable 'myVariable' should exist on app.py")
```
![Testing Functions in Python](https://ucarecdn.com/ab3f9bbd-beff-492e-ad37-3be3fba18cfe/testingfunctionspythonbreathecodecli.jpg)

### 4) Testing a print (stdout) in the entire app.py
```py
import io
import sys

@pytest.mark.it('3. The printed value on the console should be "red"')
def test_for_file_output(capsys, app):
    app()
    captured = capsys.readouterr()
    assert "red!\n" == captured.out
```
![Testing Stdout in Python](https://ucarecdn.com/c95e4deb-0e57-4aa3-8f89-486b4f1eb1cc/testingstdoutpythonbreathecodecli.jpg)

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

![Testing Stdin in Python](https://ucarecdn.com/eb33c3dd-3bda-4aeb-83be-b61cfd82ffae/testingstdinpythonbreathecodecli.jpg)
