'use strict';
/**
 * 滑动开关按钮
 * jQuery.slideBtn
 */
(function () {
    var defaults = {
        ns: '', //命名空间
        chkID: 'chk', //自定义checkbox ID
        chkClazz: 'chk-clazz', //自定义checkbox class
        label: ['开', '关'], //显示的文本
        changed: $.noop, //当状态改变时触发的回调
        beforeChanged: $.noop //状态改变之前触发的回调
    };
    var generateDom = function (dom, option) {
        var $wrap = $('<div class="slide-btn-wrap"></div>'),
            $checkbox = $('<input type="checkbox" />');

        return dom.append($wrap);
    };
    var methods = {
        init: function (dom, option) {
            generateDom(dom, option);
        },
        update: function (dom) {

        }
    };
    $.fn.slideBtn = function (method, option) {
        option = $.extend(true, {}, defaults, option);
        methods[method].call(methods, $(this), option);
        return this;
    };
})(jQuery);