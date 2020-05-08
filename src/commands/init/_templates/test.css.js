
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
// const css = fs.readFileSync(path.resolve(__dirname, "./styles.css"), "utf8");

jest.dontMock("fs");


test("The background should be blue", function() {
  document.documentElement.innerHTML = html.toString();
  const body = document.querySelector("body");
  var styles = window.getComputedStyle(body);
  expect(styles["background"]).toBe("blue");
});

test("The body tag should not contains any inline style", function() {
  document.documentElement.innerHTML = html.toString();
  let bodyInlineStyle = document.getElementsByTagName("body");
  let emptyBodyInlineStyle = {};
  expect(bodyInlineStyle[0].style._values).toEqual(emptyBodyInlineStyle);
});

test("You should not change the existing head tag elements", function () {
  document.documentElement.innerHTML = html.toString();
  let meta1 = document.getElementsByTagName('head')[0].innerHTML.toString().indexOf("<meta c")
  let meta2 = document.getElementsByTagName('head')[0].innerHTML.toString().indexOf("<meta n")

  expect(meta1).not.toBe(-1)
  expect(meta2).not.toBe(-1)
})
