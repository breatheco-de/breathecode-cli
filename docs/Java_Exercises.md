# Grading Exercises in Java

1. Testing function of variable declarations.
2. Testing `System.out.println` (stdout)
3. Testing `BufferedReader reader.readLine` (stdin)

### Testing a print (stdout) in Python
You can replace the System.out function with a ByteArrayOutputStream like this:

```java
import static org.junit.Assert.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.io.IOException;

public class Test{

    private PrintStream sysOut;
    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    // private Mockery context = new Mockery();
    @org.junit.Before
    public void setUpStreams() throws IOException{
      sysOut = System.out;
      System.setOut(new PrintStream(outContent));
    }

    @org.junit.After
    public void revertStreams() {
      System.setOut(sysOut);
    }

    @org.junit.Test
    public void testAdd() throws IOException{

      try
      {
        App a = new App();
        a.main(new String[0]);
      }
      catch(IOException superException){
        //error handling code
        System.out.println("Exception occurred"+superException.toString());
      }
      //String str = "Junit is workingfefefeer fine";
      assertEquals("Hello World\n", outContent.toString());
    }
}
```

### Testing stdin (reader.readLine()) in Java

You can replace the System.in with a ByteArrayInputStream like this:

```java
import static org.junit.Assert.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.io.IOException;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
public class Test{

    private PrintStream sysOut;
    private InputStream sysIn;
    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    // private Mockery context = new Mockery();
    @org.junit.Before
    public void setUpStreams() throws IOException{
      sysOut = System.out;
      System.setOut(new PrintStream(outContent));

      sysIn = System.in;
      System.setIn(new ByteArrayInputStream("bob\ndylan\n".getBytes()));
    }

    @org.junit.After
    public void revertStreams() {
        System.setOut(sysOut);
        System.setIn(sysIn);
    }

    @org.junit.Test
    public void testAdd() throws IOException{

      try
      {
        App a = new App();
        a.main(new String[0]);
      }
      catch(IOException superException){
        //error handling code
        System.out.println("Exception occurred"+superException.toString());
      }
      //String str = "Junit is workingfefefeer fine";
      assertEquals("My name is bob dylan\n", outContent.toString());
    }
}

```
