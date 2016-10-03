### 变量命名|js_name_convention
> 使用驼峰式命名规则。
 前端文件命名：文件名应该由小写字母组成，且每个单词之间使用下滑线("_")来连接。例如：code_guide.js  
 NodeJS文件命名：遵循驼峰命名，首字母大写，以Action、Service、Dao、Util结尾。例如：CodeGuideAction.js  
 配置文件命名：以"功能名.config.js"的形式来书写，功能名尽量使用一个单词来表示，单词必须小写，若必须使用多个单词表示时，可以使用短横线("-")来连接。 例如：local-passport.config.js  
 HTML中元素ID的命名：由小写字母组成，且每个单词之间使用下滑线("_")来连接。例如：elem_id  
 CSS选择器的命名：由小写字母组成，且每个单词之间使用短横线("-")来连接。例如：elem-clzz  
 不得使用保留字或者关键字来作为变量名！  
 
```js  

    /* Bad example */
    FunctionNames
    VariableNames
    classNames
    ENUMNAMES
    MethodNames
    Symbolic_constants  
    
    /* Good example */
    functionNamesLikeThis
    variableNamesLikeThis
    ClassNamesLikeThis
    EnumNamesLikeThis
    methodNamesLikeThis
    SYMBOLIC_CONSTANTS_LIKE_THIS
```
### 变量声明|js_variable
> 变量必须要使用var来声明，且尽量保证var在同一作用域内只会出现一次。  
一般情况下不要定义全局变量，因为很容易引起变量名冲突，造成变量被重写！如果必须要定义全局变量，则可以使用window['变量名']的方式来定义。 
 
```js  

    /* Bad example */
    var ns;
    var no = undefined;
    var types = 1 + 3 * 2;
    var ext = "jpg,png,gif";
    var trash = Boolean(false);
    var obj = new Object();
    var items = new Array(12, 67);
    var note = types + ext;
    var prefixname = "[DEV]";
    var input = "<input id=\"yui\"/>";
    var sencodes_tables = {
        MINUTE : 60,
        HOUR : 60 * 60,
        DAY : 60 * 60 * 24
    };
    Local = 231;
    glb = 100;

    /* Good example */
    var ns,
        no,
        types = 7,
        ext = 'jpg,png,gif',
        trash = false,
        obj = {},
        items = [12, 67],
        note = types + ext,
        PREFIX_NAME = '[DEV]',
        input = '<input id="yui"/>',
        SECONDS_TABLE = {
            minute : 60,
            // 60*60
            hour : 3600,
            //60 * 60 * 24
            day : 86400
        },
        Local = 231;
    Window['glb']= 100;
```
### 严格模式|js_strict_mode
> 由于JS是一门弱类型的语言，因此W3C提供了严格模式来约束前端JS代码的书写。  
通过在JS文件的第一行或者是在JS函数里面的第一行书写'"use strict";'来告诉编译器使用严格模式来编译本文件或本函数内的JS代码
 
```js  

    /* Bad example */
    /* Compiler won't  report any error.*/
    (function(){
      x = 3.14;
      console.log(x);
      // Define your library strictly...
    })();

    /* Bad example */
    /* Compiler would  report an error.*/
    (function(){
      "use strict";
      x = 3.14;
      console.log(x);
    })();

    /* Good example */
    (function(){
      "use strict";
      var x = 3.14;
      console.log(x);
      // Define your library strictly...
    })();
```
### 注释|js_comments
> 对于函数应该使用块级注释或文档注释，对于代码块应该使用单行注释
 
```js  

    /* Bad example */
    /*
     * Block comments.
     * Show log at console panel.
     */
    function log(num, arguments){
        /**
         * line comments
         */
        if(arguments){
            for(var i=0,size=arguments.length;i<size;i++){
                //TODO
            }
        }
        return true;
    }


    /* Good example */
    /**
     * Block comments.
     * Show log at console panel.
     * @param {Number|String} num line number.
     * @param {Array} arguments opt params.
     * @returns {boolean}
     */
    function log(num, arguments){
        //if statement.
        //Single line comments
        if(arguments){
            for(var i=0,size=arguments.length;i<size;i++){
                //TODO
            }
        }
        return true;
    }
```
### 单引号和双引号|js_quotes
> 应当总是优先使用单引号来表示字符串
 
```js  

    /* Bad example */
    var str = "name";
    "<a href='' id='bad_demo'></a>"
    "<a href=\"\" id=\"bad_demo1\"></a>"


    /* Good example */
    var str = 'name';
    '<a href="" id="good_demo"></a>'
```
### 条件表达式和等式|js_condition_expression
> 应当总是使用三等号'==='来作等值判断  
JS中的null、undefined、0，均可以自动转换为布尔值，且表示false。
 
```js  

    /* Bad example */
    if('QWERT' == tag){
        //TODO
    }

    if(3 == num){
        //TODO
    }

    var arr = [0,2,3];
    if(arr.length > 0){
        //TODO
    }else{
        //TODO
    }


    /* Good example */
    if('QWERT' === tag){
        //TODO
    }

    if(3 === num){
        //TODO
    }

    var arr = [0,2,3];
    if(arr.length){
        //TODO
    }else{
        //TODO
    }
```
### 减少冗余的变量声明|js_redundant_variable
> 见示例。
 
```js  

    /* Bad example */
    function foo(path) {
        //TODO
        var newPath = path.replace('resources/framework', pathToFrameworkRoot + '/WebContent/resources/framework');
        return newPath;
    }

    function isNum(charCode) {
        if (charCode != 8 && charCode != 0 && (charCode < 48 || charCode > 57)) {
            return false;
        } else {
            return true;
        }
    }


    /* Good example */
    function foo(path) {
        return path.replace('resources/framework', pathToFrameworkRoot + '/WebContent/resources/framework');
    }

    function isNum(charCode) {
        return !(charCode != 8 && charCode != 0 && (charCode < 48 || charCode > 57));
    }
```
### For 循环的优化|js_for_loop
> 见示例。
 
```js  

    /* Bad example */
    var arr = [];
    for ( var i = 0; i < arr.length; i++) {

    }


    /* Good example */
    var arr = [];
    for (var i = 0, size = arr.length; i < size; i++) {

    }
```
### For in 循环|js_forin_loop
> 必须加上hasOwnProperty判断。
 
```js  

    /* Bad example */
    var fields = {
        _id : 'k001',
        name : 'qwert',
        age : 18
    };
    for ( var key in fields) {
        var value = fields[key];
        // TODO
    }


    /* Good example */
    var fields = {
        _id  : 'k001',
        name : 'qwert',
        age : 18
    };
    for ( var key in fields) {
        if (fields.hasOwnProperty(key)) {
            var value = fields[key];
            //TODO
        }
    }
```
### Switch语句|js_switch
> 见示例。
 
```js  

    /* Bad example */
    switch (type) {
        case 'string':
            // TODO
            break;
        case 'date':
            // TODO
            break;
        default:
            // TODO
    }

    /* Good example */
    switch (type) {
        case 'string': {
            // TODO
        }
            break;
        case 'date': {
            // TODO
        }
            break;
        default: {
            // TODO
        }
    }
```
### 分号和逗号|js_semicolon_comma
> 用var声明的变量、函数、字面量对象以及每一行单行语句之后，都必须要以分号(";")结尾。
 
```js  

    /* Bad example */
    var someone = {
        name : 'CC'
        ,age : 32
        ,title : 'CEO'
    }
    var fun = function(){
        //TODO
    }
    function foo(){
        //TODO
    };
    var others = {
        name : 'CC',
        age : 32,
        title : 'CEO',
        hands : ['left','right'],
    };


    /* Good example */
    var someone = {
        name : 'CC',
        age : 32,
        title : 'CEO'
    };
    var fun = function(){
        //TODO
    };
    function foo(){
        //TODO
    }
    var others = {
        name : 'CC',
        age : 32,
        title : 'CEO',
        hands : ['left','right']
    };
```
### 内部函数定义|js_inner_function
> 在函数体内部，不要以代码块的形式来定义一个内部函数；应该以变量的方式来定义。
 
```js  

    /* Bad example */
    function test(){
        while(statement){//if, for or other code block
            //TODO
            function Inner(){
                //TODO
            }
        }
    }


    /* Good example */
    function test(){
        while(statement){//if, for or other code block
            //TODO
            var _inner = function(){
                //TODO
            };
        }
    }
```
### String转换为Number|js_string_number
> parseInt：如果字符串是以"0"开头时，需要指明基数。  
Number：性能优于parseInt。
 
```js  

    /* Bad example */
    parseInt('08');
    parseInt('10086', 10);
    '10086' >> 0;


    /* Good example */
    parseInt('08', 10);
    Number('10086');
```
### 字符串拼接|js_string_concat
> 拼接字符串时使用Array.join方法来代替加号("+")
 
```js  

    /* Bad example */
    var items = [ {
        name : 'CK',
        age : 32
    }, {
        name : 'UI',
        age : 12
    } ], str = '';

    for ( var i = 0, size = items.length; i < szie; i++) {
        str += items[i].name;
    }
    console.log(str);


    /* Good example */
    var items = [ {
        name : 'CK',
        age : 32
    }, {
        name : 'UI',
        age : 12
    } ], str = [];

    for ( var i = 0, size = items.length; i < szie; i++) {
        st[i] = items[i].name;
    }
    console.log(str.join(''));
```
### 不要修改内建对象的原型|js_modify_buildin_object
> 不要随意修改内建对象的原型！
 
```js  

        /* Bad example */
        String.prototype.trim = function() {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };
```
### JSON书写规范|js_json_convention
> 属性名应当以小写字母开头，可以使用驼峰方式或者下滑线来连接两个单词。  
属性名应当使用双引号括起来。
 
```js  

    /* Bad example */
    {
        double_quotes : "Double quotes",
        'single_quotes' : 'single quotes',
        "name with blankspace" : "Are you ok?",
        "CamelCaseKey" : "Bad key",
        "ID" : "#567890",
        "" : {
            1 : "v"
        },
        "done" : "true",
        "count" : "24567",
        "item": ["01", "02"],
        "totalItems": 2
    }


    /* Good example */
    {
        "double_quotes" : "Double quotes",
        "single_quotes" : "single quotes",
        "name_with_blankspace" : "Are you ok?",
        "camelCaseKey" : "Bad key",
        "id" : "#567890",
        "yyy" : {
            "1" : "v"
        },
        "done" : true,
        "count" : 24567,
        "totalItem": 2,
        "items": ["01", "02"]
    }
```

