### 选择器优化|jquery_selector
> 原则一：减少选择器的层级  
原则二：尽量使用类选择器来代替标签选择器  
原则三：缩小选择器的查找范围

```jquery

   /* Bad example */
   $('.cls #part_table');
   $('#part_table tbody tr');


   /* Good example */
   $('#part_table');
   $('#part_table').find('tbody tr');
   $('tbody tr', $('#part_table'));
```
### 合并选择器表达式|jquery_merge_selector
> 通过合并选择器表达式，可以帮助减少代码量。

```jquery

     /* Bad example */
    $('#report_div').addClass('tabDiv');
    $('#profiling_div').addClass('tabDiv');
    $('#trace_view_div').addClass('tabDiv');
    $('#debug_view_div').addClass('tabDiv');
    $('#tree_view_div').addClass('tabDiv');


    /* Good example */
    $('#report_div, #profiling_div, #trace_view_div, #debug_view_div, #tree_view_div').addClass('tabDiv');
```
### 缓存JQuery对象|jquery_cache_selector
> 同一个JQuery对象如果在代码中出现了两次，就应当将其缓存。因为DOM的查找非常非常耗性能！

```jquery

    /* Bad example */
    if ($("#debug_view_div").length < 1) {
        // TODO

        $(XXX).appendTo($("#debug_view_div"));
        // TODO
        $('<div/>', {
            'border' : '1px Solid'
        }).appendTo($("#debug_view_div"));
        //TODO
    }


    /* Good example */
    var debugView = $('#debug_view_div');//缓存
    if (!debugView.length) {
        // TODO

        $(XXX).appendTo(debugView);
        // TODO
        $('<div/>', {
            'border' : '1px Solid'
        }).appendTo(debugView);
        //TODO
    }
```
### JQuery链式写法|jquery_chains
> 链式写法可以帮助减少代码量，增强可读性。

```jquery

    /* Bad example */
    $('#span'+subConfigId).removeClass('bluechecked');
    $('#span'+subConfigId).addClass('nochecked');

    function updateEOL(lifeCycleInfo, self) {
        var featureDiv = self.find("#feature");
        featureDiv.empty();
        featureDiv.text(lifeCycleInfo.choiceTitle);
        var valueDiv = self.find("#value");
        valueDiv.empty();
        valueDiv.text(lifeCycleInfo.choiceItem);
        var eolDiv = self.find("#eol");
        eolDiv.empty();
        var endOfLife = formatLongDate(lifeCycleInfo.eol);
        eolDiv.text(endOfLife);
    }


    /* Good example */
    $('#span'+subConfigId).removeClass('bluechecked').addClass('nochecked');

    function updateEOL(lifeCycleInfo, self) {
        self.find("#feature").empty().text(lifeCycleInfo.choiceTitle);
        self.find("#value").empty().text(lifeCycleInfo.choiceItem);
        self.find("#eol").empty().text(formatLongDate(lifeCycleInfo.eol));
    }
```