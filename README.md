# UI_lib
`前端UI库，主要包括：代码规范、常用插件、样式框架、字体。`

#UI地址
`http://yuanhongb.github.io/UI_lib/index.html`

#代码规范
`http://yuanhongb.github.io/UI_lib/frontend/html/wrapper.html#code_guide`

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Marked in the browser</title>
  <script src="lib/marked.js"></script>
</head>
<body>
  <div id="content"></div>
  <script>
    document.getElementById('content').innerHTML =
      marked('# Marked in browser\n\nRendered by **marked**.');
  </script>
</body>
</html>
```
