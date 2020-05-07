# Testing for The DOM

Make sure to fill the DOM with some HTML

```js
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
document.documentElement.innerHTML = html.toString();
```

You can do the same for CSS
```js
const css = fs.readFileSync(path.resolve(__dirname, './styles.css'), 'utf8');
document.querySelector("head").innerHTML=`<style>${css.toString()}</style>`;
```

## Testing for using the alert() function

```js
test('alert() function should be called passing it the id of the h1 element', function () {

      /*
          Here is how to mock the alert function:
          https://stackoverflow.com/questions/41885841/how-to-mock-the-javascript-window-object-using-jest
      */
      global.alert = jest.fn((text) => null);

      //and I expect the alert to be already called.
      expect(alert.mock.calls.length).toBe(1);
      expect(alert).toHaveBeenCalledWith("theTitle");
});
```

## Testng that an element has a particular style
```js
it("the background should match", function () {
    let body=document.querySelector("body");
    let styles=window.getComputedStyle(body);
    expect(styles["background"]).toBe(
      `url(http://assets.breatheco.de/apis/img/bg/background-vertical.jpg) repeat-y`
    );
});
 ```
 
 ## Check that QuerySelector is being called
 
 ```js
 it('querySelector function should be called once', function () {

    /*
        Here is how to mock the alert function:
        https://stackoverflow.com/questions/41885841/how-to-mock-the-javascript-window-object-using-jest
    */
    //console.log(document);
    document.querySelector = jest.fn((selector) => {
        if(selector === '#theTitle') return { id: 'theTitle' };
        else return false;
    });

    //and I expect the alert to be already called.
    expect(document.querySelector.mock.calls.length).toBe(1);
    expect(document.querySelector).toHaveBeenCalledWith("#theTitle");
});
```
