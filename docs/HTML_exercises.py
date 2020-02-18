

### Make sure a tag is present in the document

```js
 it('Add a opening strong tag <p>', function () {
    let a = document.documentElement.innerHTML = html.toString()
    expect(a.indexOf("<p>")).not.toBe(-1)
});
```


### Make sure a tag is placed before another
```js
it('The <head> opening tag needs to be added after the <html> tag', function () {
    let a = document.documentElement.innerHTML = html.toString()
    let b = a.indexOf("<head>")
    let c = a.indexOf("<html")

    expect(b).toBeLessThan(c)
})
```
