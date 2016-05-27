'use strict';
$(function () {
    function encodeHtml(s) {
        var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return (typeof s !== "string") ? s :
            s.replace(REGX_HTML_ENCODE,
                function ($0) {
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c === 0x20) ? 0xA0 : c;
                    r.push(c);
                    r.push(";");
                    return r.join("");
                });
    }

    function initHighlight() {
        hljs.configure({tabReplace: '   '});
        hljs.initHighlightingOnLoad();
    }

    initHighlight();

    var baseUrl = '../html/tpl/code/';
    $('.html-ul [code-pretty]').each(function () {
        var $thiz = $(this),
            $wrap = $('.html-wrapper'),
            id = $thiz.attr('code-pretty'),
            $section = $('<div class="section"></div>').attr('id', id),
            $codeDesc = $('<div class="col code-desc"></div>').appendTo($section),
            $codeArea = $('<div class="col code-area"></div>').appendTo($section),
            $tempArea = $('<div class="temp-area" hidden></div>'),
            url = [baseUrl, 'html/', id, '.html'].join('');
        $tempArea.load(url, function () {
            var $textarea = $tempArea.find('textarea[hidden]').remove(),
                clazz = $textarea.attr('class'),
                codeHtml = $textarea.val() || '';
            codeHtml.length && $codeArea.prepend('<pre><code ' + (clazz) + '>' + encodeHtml(codeHtml) + '</code></pre>');
            $codeDesc.prepend($tempArea.find('.col-desc[hidden]').html());
            $tempArea.remove();
            $section.appendTo($wrap);
        });
    });

    $('.css-ul [code-pretty]').each(function () {
        var $thiz = $(this),
            $wrap = $('.css-wrapper'),
            id = $thiz.attr('code-pretty'),
            $section = $('<div class="section"></div>').attr('id', id),
            $codeDesc = $('<div class="col code-desc"></div>').appendTo($section),
            $codeArea = $('<div class="col code-area"></div>').appendTo($section),
            $tempArea = $('<div class="temp-area" hidden></div>'),
            url = [baseUrl, 'css/', id, '.html'].join('');
        $tempArea.load(url, function () {
            var $textarea = $tempArea.find('textarea[hidden]').remove(),
                clazz = $textarea.attr('class'),
                codeHtml = $textarea.val() || '';
            codeHtml.length && $codeArea.prepend('<pre><code ' + (clazz) + '>' + encodeHtml(codeHtml) + '</code></pre>');
            $codeDesc.prepend($tempArea.find('.col-desc[hidden]').html());
            $tempArea.remove();
            $section.appendTo($wrap);
        });
    });

    $('.js-ul [code-pretty]').each(function () {
        var $thiz = $(this),
            $wrap = $('.js-wrapper'),
            id = $thiz.attr('code-pretty'),
            $section = $('<div class="section"></div>').attr('id', id),
            $codeDesc = $('<div class="col code-desc"></div>').appendTo($section),
            $codeArea = $('<div class="col code-area"></div>').appendTo($section),
            $tempArea = $('<div class="temp-area" hidden></div>'),
            url = [baseUrl, 'js/', id, '.html'].join('');
        $tempArea.load(url, function () {
            var $textarea = $tempArea.find('textarea[hidden]').remove(),
                clazz = $textarea.attr('class'),
                codeHtml = $textarea.val() || '';
            codeHtml.length && $codeArea.prepend('<pre><code ' + (clazz) + '>' + encodeHtml(codeHtml) + '</code></pre>');
            $codeDesc.prepend($tempArea.find('.col-desc[hidden]').html());
            $tempArea.remove();
            $section.appendTo($wrap);
        });
    });

    setTimeout(function () {
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    }, 2000);
});