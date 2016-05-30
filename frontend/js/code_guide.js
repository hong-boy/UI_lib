'use strict';
$(function () {
    var codeGuider = {
        _baseUrl: '../html/tpl/code/',
        init: function () {
            var thiz = this,
                baseUrl = thiz._baseUrl;
            thiz.initHighlight().initJS(baseUrl).initCSS(baseUrl).initHTML(baseUrl).initJQuery(baseUrl);
        },
        initHighlight: function () {
            hljs.configure({tabReplace: '   '});
            hljs.initHighlightingOnLoad();
            return this;
        },
        initHTML: function (baseUrl) {
            var thiz = this,
                $wrap = $('.html-wrapper'),
                url = [baseUrl, 'html/', '{0}.html'].join('');
            $('.html-ul [code-pretty]').each(function () {
                var $thiz = $(this),
                    id = $thiz.attr('code-pretty');
                thiz.generateTemplate($wrap, id, IOT.formatString(url, id), function ($code) {
                    hljs.highlightBlock($code);
                });
            });
            return this;
        },
        initCSS: function (baseUrl) {
            var thiz = this,
                $wrap = $('.css-wrapper'),
                url = [baseUrl, 'css/', '{0}.html'].join('');
            $('.css-ul [code-pretty]').each(function () {
                var $thiz = $(this),
                    id = $thiz.attr('code-pretty');
                thiz.generateTemplate($wrap, id, IOT.formatString(url, id), function ($code) {
                    hljs.highlightBlock($code);
                });
            });
            return this;
        },
        initJS: function (baseUrl) {
            var thiz = this,
                $wrap = $('.js-wrapper'),
                url = [baseUrl, 'js/', '{0}.html'].join('');
            $('.js-ul [code-pretty]').each(function () {
                var $thiz = $(this),
                    id = $thiz.attr('code-pretty');
                thiz.generateTemplate($wrap, id, IOT.formatString(url, id), function ($code) {
                    hljs.highlightBlock($code);
                });
            });
            return this;
        },
        initJQuery: function (baseUrl) {
            var thiz = this,
                $wrap = $('.jq-wrapper'),
                url = [baseUrl, 'jquery/', '{0}.html'].join('');
            $('.jq-ul [code-pretty]').each(function () {
                var $thiz = $(this),
                    id = $thiz.attr('code-pretty');
                thiz.generateTemplate($wrap, id, IOT.formatString(url, id), function ($code) {
                    hljs.highlightBlock($code);
                });
            });
            return this;
        },
        generateTemplate: function ($wrap, id, url, cb) {
            var $section = $('<div class="section"></div>').attr('id', id),
                $codeDesc = $('<div class="col code-desc"></div>').appendTo($section),
                $codeArea = $('<div class="col code-area"></div>').appendTo($section),
                $tempArea = $('<div class="temp-area" hidden></div>');

            $tempArea.load(url, function () {
                var $textarea = $tempArea.find('textarea[hidden]').remove(),
                    clazz = $textarea.attr('class'),
                    codeHtml = $textarea.val() || '';
                codeHtml.length && $codeArea.prepend('<pre><code ' + (clazz) + '>' + IOT.encodeHtml(codeHtml) + '</code></pre>');
                $codeDesc.prepend($tempArea.find('.col-desc[hidden]').html());
                $tempArea.remove();
                $section.appendTo($wrap);
                //$.isFunction(cb) && cb($codeArea.find('code'));
            });
        }
    };

    codeGuider.init();
    setTimeout(function () {
        $('pre code').each(function (i, item) {
            hljs.highlightBlock(item);
        });
    }, 2000);
});