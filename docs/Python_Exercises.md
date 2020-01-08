# Grading Exercises in Python

1. Testing content of the file.
2. Testing function of variable declarations.
3. Testing `print` (stdout) for the entire application
4. Testing `input` (stdin)

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
![Testing Functions in Python](https://ucarecdn.com/ab3f9bbd-beff-492e-ad37-3be3fba18cfe/testingfunctionspythonbreathecodecli.jpg)

### 3) Testing a print (stdout) in Python
```py
import io
import sys
sys.stdout = buffer = io.StringIO()

@pytest.mark.it('3. The printed value on the console should be "red"')
def test_for_file_output(capsys):
    captured = buffer.getvalue()
    assert captured == "red\n"
```
![Testing Stdout in Python](https://ucarecdn.com/c95e4deb-0e57-4aa3-8f89-486b4f1eb1cc/testingstdoutpythonbreathecodecli.jpg)

### 4) Testing stdin (using input function) in Python

```py
import pytest, io, sys, json

@pytest.mark.it('Sum all three input numbers and print on the console the result')
def test_add_variables(mocker, stdin):

    _stdin = json.loads(stdin)
    mocker.patch('builtins.input', lambda x: _stdin.pop(0))

    sys.stdout = buffer = io.StringIO()
    import app

    _stdin = json.loads(stdin)
    sumatory = int(_stdin[0]) + int(_stdin[1]) + int(_stdin[2])

    assert buffer.getvalue() == str(sumatory)+"\n"
```

![Testing Stdin in Python](https://ucarecdn.com/eb33c3dd-3bda-4aeb-83be-b61cfd82ffae/testingstdinpythonbreathecodecli.jpg)
