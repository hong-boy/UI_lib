'use strict';
/**
 * 扩展原生类型
 * 'ex' stands for 'extend'
 */
(function () {
    /**
     * 将字符串中的占位符转换为给定字符
     * @param str 目标字符串 形如：'/users/{0}?password={1}'，其中0\1代表占位符所对应的参数的顺序
     * @returns {*} 返回一个新的字符串
     */
    String.prototype.exFormat = function () {
        var str = this;
        if (!str || !str.length) {
            return str;
        }
        for (var tempStr = str, i = 0, len = arguments.length; i < len; i++) {
            tempStr = tempStr.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return tempStr;
    }
})();
/**
 * 字符统计插件
 * $.fn.charCount
 */
(function ($) {
    var defaults = {
        allowed: 200,
        warning: 180,
        css: 'counter',
        counterElement: 'span',
        cssWarning: 'warning',
        cssExceeded: 'exceeded',
        //counterText: '<font color="#333">{current}</font> / <font color="#999">{allowed}</font>' //支持占位符写法，形如：{current}/{allowed}/{available}
        counterText: '<font color="#999" style="font-size:12px">还可以输入{available}字</font>' //支持占位符写法，形如：{current}/{allowed}/{available}
    };

    function calculate(obj) {
        var count = $(obj).val().length;
        var options = $(obj).data('options');
        var allowed = options.allowed;
        var available = allowed - count;
        if (available <= options.warning && available >= 0) {
            $(obj).next().addClass(options.cssWarning);
        } else {
            $(obj).next().removeClass(options.cssWarning);
        }
        if (available < 0) {
            $(obj).next().addClass(options.cssExceeded);
        } else {
            $(obj).next().removeClass(options.cssExceeded);
        }
        var tpl = options.counterText;
        $(obj).next().html(tpl.replace('{current}', count).replace('{allowed}', allowed).replace('{available}', available));
    }

    $.fn.charCount = function (options) {

        var options = $.extend(defaults, {allowed: $(this).attr('maxlength')}, options);
        var tpl = options.counterText;
        var counterText = tpl.replace('{current}', 0).replace('{allowed}', options.allowed).replace('{available}', 0);
        this.each(function () {
            var $parent = $(this).parent();
            if ($parent.css('position') === 'static') {
                $parent.css('position', 'relative');
            }
            $(this).data('options', options)
                .after('<' + options.counterElement + ' class="' + options.css + '" style="position:absolute; bottom:0; margin-left:10px">' + counterText + '</' + options.counterElement + '>');
            calculate(this);
            $(this).keyup(function () {
                calculate(this)
            });
            $(this).change(function () {
                calculate(this)
            });
        });

    };
})(jQuery);

/**
 * 滑动开关按钮
 * jQuery.slideBtn
 */
(function ($) {
    var SPLITER = '_';
    var defaults = {
        ns: '', //命名空间
        chkID: 'chk', //自定义checkbox ID
        chkClazz: 'chk-clazz', //自定义checkbox class,
        checked: true, //是否选中
        disabled: false, //是否禁用
        minWidth: '110px', //定义wrap容器的最小宽度
        labels: null, //显示的文本，形如：['开阀', '关阀']
        changed: null //当状态改变时触发的回调
    };
    var renderWrapStyle = function ($wrap, option) {
        //checkbox样式
        var $chkbox = $('input:checkbox', $wrap);
        option.checked && $chkbox.attr('checked', true);
        option.disabled && $chkbox.attr('disabled', true);
        //定义wrap容器最小宽度
        option.minWidth && $wrap.css('min-width', option.minWidth);
    };
    var bindEvent = function ($wrap, option) {
        //input[type="checkbox"] - change事件
        $wrap.find('input:checkbox').unbind('change.slide').bind('change.slide', function (e) {
            var $wrap = $(this).parents('.slide-btn-wrap'),
                chkID = $(this).attr('id'),
                $labelOn = $('.slide-btn-on', $wrap).removeClass('slide-clickable').removeAttr('for'),
                $labelOff = $('.slide-btn-off', $wrap).removeClass('slide-clickable').removeAttr('for'),
                option = $wrap.data('option') || {};
            if ($(this).prop('checked')) {
                $labelOff.addClass('slide-clickable').attr('for', chkID);
            } else {
                $labelOn.addClass('slide-clickable').attr('for', chkID);
            }
            $.isFunction(option.changed) && option.changed($(this));
            return false;
        });
    };
    var generateDom = function (dom, option) {
        var $wrap = $('<div class="slide-btn-wrap"></div>'),
            $label = $('<label class="slide-btn-label"></label>'),
            $div = $('<div class="slide-btn-chk"></div>'),
            ns = option.ns,
            chkID = option.chkID,
            chkClazz = option.chkClazz,
            $checkbox = $(['#', chkID, '[type="checkbox"]'].join(''));
        $checkbox = $checkbox.length ? $checkbox : $('<input type="checkbox"/>').attr({
            id: [ns, chkID].join(SPLITER),
            'class': chkClazz
        });
        $label.append($checkbox).append($div).appendTo($wrap);
        if (option.labels && option.labels.length > 1) {
            var labels = option.labels.slice(0, 2),
                tempChkID = $checkbox.attr('id'),
                $labelOn = $('<label class="slide-btn-on slide-clickable"></label>').text(labels[0]).attr('for', tempChkID),
                $labelOff = $('<label class="slide-btn-off slide-clickable"></label>').text(labels[1]).attr('for', tempChkID);
            option.checked && $labelOn.removeClass('slide-clickable').removeAttr('for');
            !option.checked && $labelOff.removeClass('slide-clickable').removeAttr('for');
            $labelOn.insertAfter($label);
            $labelOff.insertBefore($label);
        }
        renderWrapStyle($wrap, option);
        bindEvent($wrap, option);
        dom.append($wrap.data('option', option));
        return $wrap;
    };
    var refreshDom = function ($wrap, option) {
        var ns = option.ns,
            chkID = option.chkID,
            chkClazz = option.chkClazz,
            $checkbox = $('input:checkbox', $wrap);
        $checkbox.attr({id: [ns, chkID].join(SPLITER), 'class': chkClazz});
        if (option.labels && option.labels.length > 1) {
            var labels = option.labels.slice(0, 2),
                tempChkID = $checkbox.attr('id'),
                $labelOn = $('.slide-btn-on', $wrap).addClass('slide-clickable').text(labels[0]).attr('for', tempChkID),
                $labelOff = $('.slide-btn-off', $wrap).addClass('slide-clickable').text(labels[1]).attr('for', tempChkID);
            option.checked && $labelOn.removeClass('slide-clickable').removeAttr('for');
            !option.checked && $labelOff.removeClass('slide-clickable').removeAttr('for');
        }
        renderWrapStyle($wrap, option);
        bindEvent($wrap, option);
        return $wrap.data('option', option);
    };
    var methods = {
        init: function (dom, option) {
            option = $.extend(true, {}, defaults, option);
            return generateDom(dom, option);
        },
        refresh: function ($wrap, option) {
            var original = $wrap.data('option');
            option = $.extend(true, {}, defaults, original, option);
            refreshDom($wrap, option);
            return $wrap;
        }
    };
    $.fn.slideBtn = function (method, option) {
        return methods[method].call(methods, $(this).first(), option);
    };
})(jQuery);

/**
 * 带加载效果的按钮
 * jQuery.spinner
 * @dependency: window.Spinner|String.prototype.exFormat
 */
(function ($) {
    var DATA_TAG = 'loadingBtn'; //tag
    //ps: 自定义的JS配置项的优先级高于自定义的DOM节点配置项
    var DEFAULTS = {
        spinner: {
            size: 24, //spinner尺寸 对应的DOM节点属性：data-spinner-size
            color: '#FFF', //spinner颜色 data-spinner-color
            lines: 12 //spinner线条数量 data-spinner-lines
        },
        timeout: 5 * 60 * 1000, //超时时长（ms） data-spinner-timeout
        timeoutCallback: null //超时后需要执行的回调函数
    };

    //创建spinner
    var createSpinner = function ($dom, option) {
        var spinnerColor, spinnerLines, height = $dom.outerHeight(), opts = option.spinner;

        if (height === 0) {
            height = parseFloat($dom.css('height'));
        }

        if (height > 32) {
            height *= 0.8;
        }

        if (opts.size) {
            height = parseInt(opts.size, 10);
        }

        if (opts.color) {
            spinnerColor = opts.color;
        }

        if (opts.lines) {
            spinnerLines = parseInt(opts.lines, 10);
        }

        var radius = height * 0.2,
            length = radius * 0.6,
            width = radius < 7 ? 2 : 3;

        return new Spinner({
            color: spinnerColor || '#fff',
            lines: spinnerLines || 12,
            radius: radius,
            length: length,
            width: width,
            zIndex: 'auto',
            top: '50%',
            left: '50%'
        });
    };

    var startTick = function (dom, time) {
        var timer = setTimeout(function () {
            this.spinner('stop');
            var option = this.data(DATA_TAG);
            option.timeoutCallback && option.timeoutCallback(this);
        }.bind(dom), time);
        dom.data('{0}timer'.exFormat(DATA_TAG), timer);
    };
    var clearTick = function (dom) {
        clearTimeout(dom.data('{0}timer'.exFormat(DATA_TAG)));
    };
    var methods = {
        create: function (dom, option) {
            if (!$.isPlainObject(dom.data(DATA_TAG))) {
                var nodeOption = {
                    spinner: {
                        size: dom.attr('data-spinner-size'),
                        color: dom.attr('data-spinner-color'),
                        lines: dom.attr('data-spinner-lines')
                    },
                    timeout: dom.attr('data-spinner-timeout')
                };
                option = $.extend(true, {}, DEFAULTS, nodeOption, option);
                var $label = $('<span class="loading-btn-label"></span>'),
                    $spinner = $('<span class="loading-btn-spinner"></span>');
                $label.html(dom.html());
                createSpinner(dom, option).spin($spinner[0]);
                dom.addClass('loading-btn').data(DATA_TAG, option);
                dom.empty().append($label).append($spinner);
            }
            return dom;
        },
        start: function (dom) {
            var option = dom.data(DATA_TAG);
            if ($.isPlainObject(option)) {
                var bgColor = dom.css('background-color');
                dom.attr('disabled', true).attr('data-loading', true).css('background-color', bgColor);
                startTick(dom, option.timeout);
            } else {
                console.error('option is empty', option);
            }
            return dom;
        },
        stop: function (dom) {
            clearTick(dom);
            dom.removeAttr('data-loading').removeAttr('disabled').css('background-color', '');
            return dom;
        },
        isLoading: function (dom) {
            return dom[0].hasAttribute('data-loading');
        },
        destroy: function (dom) {
            var text = dom.find('.loading-btn-label').html();
            $.isPlainObject(dom.data(DATA_TAG)) && dom.spinner('stop').data(DATA_TAG, null).empty().html(text);
            return dom;
        }
    };
    $.fn.spinner = function (method, option) {
        return methods[method].call(null, $(this).first(), option);
    };
})(jQuery);

/**
 * 消息提示框 - IOTips
 * @dependency: String.prototype.exFormat
 */
(function (window, $, undefined) {
    var COUNTER = 1; //计数器
    var role = 'iotips'; //tag标记
    var DEFAULTS = {
        ns: 'iot-tips', //命名空间
        type: 'error', //消息类型，支持：success | error
        content: '',
        parent: 'body', //容器
        time: 3000, //显示时长，false: 表示不自动关闭
        icon: '', //false: 不显示icon
        overlay: false, //是否需要显示蒙层，形如：['#000', 0.4]
        enableMultiple: false, //是否同时显示多条消息
        zIndex: 20160816, //Z轴高度
        //closable: false, //是否需要手动关闭消息框 *
        onHide: null //回调函数，消息框消失之后的回调
    };
    window.IOTips = function (option) {
        this.id = COUNTER++;
        this.option = $.extend(true, {}, DEFAULTS, option);
    };

    /**
     * 根据消息类型生成消息框class
     * @param option
     * @returns {{clazz: string, icon: string}}
     */
    var genDialogClazz = function (option) {
        var clazz = '', iconClazz = '';
        switch (option.type) {
            case 'success':
            {
                clazz = 'iotips-success';
                iconClazz = 'icon-ok succ-text';
                break;
            }
            case 'error':
            {
            }
            default:
            {
                clazz = 'iotips-error';
                iconClazz = 'icon-warning warning-text';
                break;
            }
        }
        option.icon && (iconClazz = option.icon);
        return {clazz: clazz, icon: iconClazz};
    };

    /**
     * 创建消息框
     * @param option
     */
    var createDialog = function (dtd, option, id) {
        var ns = option.ns,
            domId = [ns, id].join('_'),
            $vDom = $('#' + domId),
            dialogClazz = genDialogClazz(option),
            $content = $('<em class="iotips-content">{0}</em>'.exFormat(option.content)),
            $dialog = $('<div class="iotips-layer {0}-cust-layer {1}"></div>'.exFormat(ns, dialogClazz.clazz)),
            $overlay = '',
            $icon = $('<i class="icon {0}"></i>'.exFormat(dialogClazz.icon));
        $vDom = $vDom.length ? $vDom : $('<div id="{0}" class="iotips-layer-wrapper" data-role="{1}"></div>'.exFormat(domId, role));
        !option.enableMultiple && $('{0} [data-role="{1}"]'.exFormat(option.parent, role)).not('#' + domId).each(function () {
            $(this).remove();
        });
        if (option.overlay && option.overlay.length > 1) {
            var overlayArr = option.overlay;
            $overlay = $('<div class="iotips-layer-overlay {0}-overlay"></div>'.exFormat(ns)).css({
                backgroundColor: overlayArr[0] || '#000',
                opacity: $.isNumeric(overlayArr[1]) ? overlayArr[1] : 0.4
            });
            $vDom.css({
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            });
        }
        $vDom.fadeOut(function () {
            $dialog.append($('<div class="iotips-content-wrap"></div>').append($icon).append($content)).css('z-index', option.zIndex);
            $vDom.empty().append($overlay).append($dialog).css('z-index', option.zIndex - 1);
            dtd.resolve($vDom);
        });
        return dtd;
    };
    /**
     * 关闭全部
     */
    IOTips.hideAll = function () {
        $('[data-role="{0}"]'.exFormat(role)).each(function () {
            var instance = $(this).data('instance');
            if (instance instanceof IOTips) {
                instance.hide();
            } else {
                $(this).remove();
            }
        });
    };
    /**
     * 显示消息
     * @param option {Object} 配置项（可选）
     */
    IOTips.prototype.show = function (option) {
        var thiz = this,
            dtd = $.Deferred();
        $.extend(true, thiz.option, option);
        $.when(createDialog(dtd, thiz.option, thiz.id))
            .done(function ($dom) {
                var parent = thiz.option.parent,
                    $parent = $(parent);
                $dom.data('instance', thiz);
                if (parent !== 'body' && parent !== 'html') {
                    $parent.css({
                        position: 'relative'
                    });
                    $dom.css({
                        position: 'absolute'
                    });
                }
                $dom.appendTo($parent).fadeIn();
            })
            .done(function () {
                //开启定时器
                thiz.option.time && setTimeout(function () {
                    thiz.hide();
                }, thiz.option.time);
            });

        return thiz;
    };
    /**
     * 关闭消息框
     */
    IOTips.prototype.hide = function () {
        var thiz = this,
            ns = thiz.option.ns,
            $dom = $('#{0}_{1}'.exFormat(ns, thiz.id));
        $dom.fadeOut(function () {
            $dom.remove();
            $.isFunction(thiz.option.onHide) && thiz.option.onHide();
        });
    };
})(window, jQuery, undefined);

/**
 * 加载中 - window.IOTLoading
 */
(function (window, $, undefined) {
    var COUNTER = 1;
    var ROLE = 'iotloading'; //tag
    var THEME_SIMPLE = 1; //普通加载框
    var DEFAULTS = {
        ns: 'iot-loading',
        theme: THEME_SIMPLE, //显示风格
        content: '加载中...', //显示的文本（当style=STYLE_SIMPLE时有效）
        spinner: {//spinner图标（当style=STYLE_SIMPLE时有效）参考Spinner.js配置项
            color: '#333',
            lines: 12,
            top: '50%',
            left: '50%'
        },
        overlay: ['#000', 0.4], //是否显示蒙层（当style=STYLE_SIMPLE时有效），形如：['#000', 0.4]，false: 表示不显示
        parent: 'body', //依附的容器
        timeout: 50 * 60 * 1000, //最大等待时长（ms），默认5mins；false：表示永不过期
        enableMultiple: false, //是否允许多个实例同时显示在页面上(同一容器下（当style=STYLE_SIMPLE时有效）)
        onHide: null //回调
    };
    window.IOTLoading = function (option) {
        this.dom = null;
        this.id = COUNTER++;
        this.option = $.extend(true, {}, DEFAULTS, option);
    };
    IOTLoading.THEME_SIMPLE = THEME_SIMPLE;
    /**
     * 获取DOM模板
     * @returns {string}
     */
    var genTemplate = function () {
        var tplArr = [
            '<div class="iot-loading-wrapper" data-role="{0}">'.exFormat(ROLE),
            '<div class="iot-loading-progress">',
            '<div class="progress-inner"></div>',
            '</div>',
            '<div class="iot-loading-activity"></div>',
            '</div>'
        ];
        return tplArr.join('');
    };
    var genSpinnerOption = function ($dom, option) {
        var spinnerOption = option.spinner,
            height = 28,
            radius = height * 0.2,
            length = radius * 0.6,
            width = radius < 7 ? 2 : 3,
            opts = {
                radius: radius,
                length: length,
                width: width,
                zIndex: 'auto'
            };
        return $.extend({}, opts, spinnerOption);
    };
    //创建普通加载框
    var createSimpleDialog = function (dtd, option, id) {
        var $parent = $(option.parent),
            overlay = option.overlay,
            $wrapper = $parent.find('> .iot-loading-wrapper'),
            theme = 'iot-loading-theme-simple';
        if (option.enableMultiple || $wrapper.length < 1) {
            var ns = option.ns,
                domId = [ns, id].join('_'),
                $dom = $(genTemplate()).addClass(theme).attr('id', domId).css('visibility', 'hidden').appendTo($parent),
                $progress = $dom.find('.iot-loading-progress').empty(),
                $spin = $('<span class="iot-loading-spinner"></span>').appendTo($progress),
                $content = $('<em class="iot-loading-content">{0}</em>'.exFormat(option.content)).appendTo($progress);
            //render spinner
            new window.Spinner(genSpinnerOption($progress, option)).spin($spin[0]);
            //render overlay
            if (overlay && overlay.length > 1) {
                $dom.css('pointer-events', 'inherit');
                var $overlay = $('<div class="iot-loading-overlay"></div>').appendTo($dom);
                $overlay.css({
                    backgroundColor: overlay[0],
                    opacity: overlay[1]
                });
            } else {
                $dom.css('pointer-events', 'none');
            }
            $wrapper = $dom;
        } else {
            var $dom = $wrapper.is(':hidden') ? $wrapper.css('visibility', 'hidden').show() : $wrapper,
                $progress = $dom.find('.iot-loading-progress'),
                $spin = $('.iot-loading-spinner', $progress),
                $content = $('.iot-loading-content', $progress).html(option.content);
            //render overlay
            if (overlay && overlay.length > 1) {
                $dom.css('pointer-events', 'inherit');
                var $overlay = $('.iot-loading-overlay', $dom);
                $overlay = $overlay.length ? $overlay : $('<div class="iot-loading-overlay"></div>').appendTo($dom);
                $overlay.css({
                    backgroundColor: overlay[0],
                    opacity: overlay[1]
                });
            } else {
                $dom.css('pointer-events', 'none');
            }
        }
        setTimeout(function () {
            dtd.resolve($wrapper);
        }, 0);
        return dtd;
    };

    //创建加载框
    var createDialog = function (dtd, option, id) {
        var $parent = $(option.parent),
            parentPos = $parent.css('position');
        if (option.parent !== 'body' && parentPos === 'static') {
            $parent.css('position', 'relative');
        }
        var promise = $.Deferred();
        $.when(createSimpleDialog(promise, option, id))
            .done(function ($dom) {
                //caculate width
                var scale = 0.7;
                var $progress = $dom.find('.iot-loading-progress');
                var currContentWidth = $dom.find('.iot-loading-content').first().css('width');
                $dom.css('height', '100%').css('visibility', '');
                var minWidth = ((parseInt(currContentWidth) + 32) / scale).toFixed(0);
                if (minWidth % 2) {
                    minWidth++;
                }
                $progress.css({minWidth: (minWidth + 'px')});
            })
            .always(function ($dom) {
                option.parent === 'body' && $dom.css('position', 'fixed');
                $dom.fadeIn();
                dtd.resolve($dom);
            });
        return dtd;
    };

    IOTLoading.prototype.show = function (option) {
        var thiz = this,
            dtd = $.Deferred();
        thiz.option = $.extend(true, thiz.option, option);
        $.when(createDialog(dtd, thiz.option, thiz.id))
            .done(function ($dom) {
                //缓存dom节点
                thiz.dom = $dom;
                var domId = $dom.attr('id'),
                    timerTag = '{0}_timer'.exFormat(domId);
                //开启超时定时器
                clearTimeout($dom.data(timerTag));
                var timer = thiz.option.timeout && setTimeout(function () {
                        thiz.hide();
                    }, thiz.option.timeout);
                $dom.data(timerTag, timer);
            });
        return this;
    };

    IOTLoading.prototype.hide = function () {
        this.dom && this.dom.fadeOut(function () {
            $.isFunction(this.option.onHide) && this.option.onHide();
        }.bind(this));
    };

    IOTLoading.prototype.destroy = function () {
        this.dom && this.dom.fadeOut(function () {
            this.dom.remove();
            this.option = null;
            this.id = null;
        }.bind(this));
    };
})(window, jQuery, undefined);

/**
 * 进度条 - window.IOTProgressbar
 */
(function (window, $, undefined) {
    var COUNTER = 1;
    var ROLE = 'IOTProgressbar'; //tag
    var TAG_TIMER = 'IOTProgTimer'; //tag
    var DEFAULTS = {
        ns: 'iot-progress-bar',
        parent: 'body', //依附的容器
        timeout: 50 * 60 * 1000, //最大等待时长（ms），默认5mins；false：表示不超时
        onHide: null //回调
    };
    window.IOTProgressbar = function (option) {
        this.dom = null;
        this.id = COUNTER++;
        this.option = $.extend(true, {}, DEFAULTS, option);
    };

    /**
     * 获取DOM模板
     * @returns {string}
     */
    var genTemplate = function () {
        var tplArr = [
            '<div class="iot-progressbar-wrapper" data-role="{0}">'.exFormat(ROLE),
            '<div class="iot-progressbar-progress">',
            '<div class="progress-inner"></div>',
            '</div>',
            '<div class="iot-progressbar-activity"></div>',
            '</div>'
        ];
        return tplArr.join('');
    };
    //创建导航条加载框
    var createNavbarDialog = function (dtd, option, id) {
        var $parent = $(option.parent),
            theme = 'iot-progressbar-theme-navbar',
            $wrapper = $parent.find('> .{0}'.exFormat(theme));
        if (!$wrapper.length) {
            var ns = option.ns,
                domId = [ns, id].join('_'),
                $dom = $(genTemplate()).addClass(theme).attr('id', domId);
            $dom.find('.iot-progressbar-progress').css('width', 0);
            $dom.appendTo($parent);
            $wrapper = $dom;
            setTimeout(function () {
                dtd.resolve($wrapper);
            }, 0);
        } else {
            $wrapper.show().find('.iot-progressbar-progress').css('width', 0);
            setTimeout(function () {
                dtd.resolve($wrapper, new Error('Cannot create more loading dialog...'));
            }, 0);
        }
        return dtd;
    };

    //创建加载框
    var createDialog = function (dtd, option, id) {
        var $parent = $(option.parent),
            parentPos = $parent.css('position');
        if (option.parent !== 'body' && parentPos === 'static') {
            $parent.css('position', 'relative');
        }
        var promise = $.Deferred();
        $.when(createNavbarDialog(promise, option, id))
            .done(function ($dom) {
                if (option.parent !== 'body') {
                    $dom.css('position', 'absolute');
                } else {
                    $dom.css('position', 'fixed');
                }
                dtd.resolve($dom);
            })
            .fail(function ($dom, err) {
                dtd.reject(err);
            });
        return dtd;
    };

    IOTProgressbar.prototype.show = function () {
        var thiz = this,
            dtd = $.Deferred();
        $.when(createDialog(dtd, thiz.option, thiz.id))
            .done(function ($dom) {
                //缓存dom节点
                thiz.dom = $dom;
                //开启超时定时器
                clearTimeout($dom.data(TAG_TIMER));
                var timer = thiz.option.timeout && setTimeout(function () {
                        thiz.hide();
                    }, thiz.option.timeout);
                $dom.data(TAG_TIMER, timer);
            })
            .fail(function (err) {
                console.error(err);
            });
    };

    IOTProgressbar.prototype.hide = function () {
        this.dom && this.dom.fadeOut(function () {
            clearTimeout(this.dom.data(TAG_TIMER));
            $.isFunction(this.option.onHide) && this.option.onHide();
        }.bind(this));
    };

    IOTProgressbar.prototype.destroy = function () {
        this.dom && this.dom.fadeOut(function () {
            clearTimeout(this.dom.data(TAG_TIMER));
            this.dom.remove();
            this.option = null;
        }.bind(this));
    };
    /**
     * 更新进度条
     * 当且仅当theme=THEME_NAVBAR时有效
     * @param{Number} progress 进度（十进制数：0-100）
     */
    IOTProgressbar.prototype.updateProgress = function (progress) {
        if (this.dom) {
            var $dom = this.dom;
            progress = progress > 100 ? 100 : progress;
            $dom.attr('data-progress', progress);
            $dom.find('.iot-progressbar-progress').css('width', (progress + '%'));
        }
        return this;
    };

})(window, jQuery, undefined);

window.IOT = {
    /**
     * 显示模态框(可以满足大部分需求)
     * @param title {String}
     * @param content {String|Function}
     * @param width {Number}
     * @param height {Number}
     * @param buttons [{click:null, text:'', clazz:'', hotkey:null, enabled:true}]
     * @param onshown {Function} 模态框渲染完成后立即调用
     * @return {{BootstrapDialog}}
     */
    displayDefaultDialog: function (title, content, width, height, buttons, onshown) {
        var btnArr = [], opts = {
            cssClass: 'light-theme',
            title: title,
            message: content,
            nl2br: false,
            size: BootstrapDialog.SIZE_CUSTOM,
            width: (width || 500) + 'px',
            height: (height || 370) + 'px',
            draggable: true,
            closable: false,
            closeByBackdrop: false,
            buttons: []
        };
        (buttons || []).forEach(function (item) {
            btnArr.push({
                action: $.isFunction(item.click) ? item.click : null,
                label: item.text,
                cssClass: item.clazz || '',
                hotkey: item.hotKey,
                enabled: item.enabled
            });
        });
        opts.buttons = btnArr;
        $.isFunction(onshown) && (opts.onshown = onshown);
        var dialog = new BootstrapDialog(opts);
        dialog.realize();
        (typeof title === 'undefined') && dialog.getModalHeader().hide();
        dialog.getModalFooter().find('button.btn').each(function () {
            //$(this).removeClass('btn');
        });
        return dialog.open();
    },
    /**
     * 确认框
     * @param content
     * @param buttons [{click:null, text:'', clazz:''}]
     * @returns {*}
     */
    confirm: function (content, yesFunc, cancelFunc) {
        var genPanel = function (dialog, content, yesFunc, cancelFunc) {
            var isJQueryObj = (content instanceof jQuery),
                $panel = $('<div class="confirm-panel text-center center-block"></div>'),
                $btnWrap = $('<div class="btn-wrap"></div>'),
                $yesBtn = $('<button class="btn btn-default">确 认</button>'),
                $cancelBtn = $('<button class="btn btn-cancel btn-default btn-empty">取 消</button>');

            $panel.append(isJQueryObj ? content : ('<em class="confirm-desc">' + (content) + '</em>')).append($btnWrap);
            $btnWrap.append(
                $yesBtn.click(function () {
                    (yesFunc || $.noop).call(null, dialog);
                })
            ).append(
                $cancelBtn.click(function () {
                    (cancelFunc || $.noop).call(null, dialog);
                })
            );
            return $panel;
        };
        var option = {
            cssClass: 'light-theme',
            nl2br: false,
            size: BootstrapDialog.SIZE_CUSTOM,
            width: '460px',
            height: '190px',
            closable: false,
            draggable: true
        };
        var dialog = new BootstrapDialog(option);
        dialog.realize();
        dialog.getModalHeader().hide();
        dialog.setMessage(genPanel(dialog, content, yesFunc, cancelFunc));
        return dialog.open();
    },
    /**
     * 消息提示
     * @param content{String|Object} 显示内容|配置对象（形如：{}）
     * @param type {String} 消息类型 包括：'success'|'error'，默认：error
     * @param time {Number} 显示{time}毫秒后自动消失
     * @param end {Function} 回调函数(消息提示框消失后立即执行)
     */
    tips: function (content, type, time, end) {
        var instance = null;
        if ($.isPlainObject(content)) {
            instance = new window.IOTips(content);
        } else {
            instance = new window.IOTips({
                content: content,
                type: type,
                time: time || 3000,
                onHide: end
            });
        }
        return instance.show();
    },
    /**
     * 显示蒙层效果-加载中...
     * 只产生一个IOTLoading实例
     * (全局显示)
     * @param content
     */
    showOverlay: function (content) {
        var opt, thiz = this, tag = 'IOTLoading', inst = thiz[tag];
        var DEFAULTS = {
            overlay: false
        };
        if ($.isPlainObject(content)) {
            opt = $.extend(true, DEFAULTS, content);
        } else {
            opt = $.extend(true, DEFAULTS, {content: content});
        }
        opt.parent = 'body';
        if (!(inst instanceof IOTLoading)) {
            inst = new window.IOTLoading(opt);
            thiz[tag] = inst;
        }
        return inst.show(opt);
    },
    /**
     * 隐藏蒙层效果-加载中...
     * （针对IOT.showOverlay产生的实例）
     */
    hideOverlay: function () {
        var thiz = this, tag = 'IOTLoading', inst = thiz[tag];
        inst && inst.hide();
        return thiz;
    },
    /**
     * 显示蒙层效果（内联样式）
     * @param $dom
     * @param content 要显示的内容
     */
    showInlineOverlay: function ($dom, content) {
        var tempArr = [
            '<div class="e-spin-wrap">',
            '<i class="icon-spinner animate-spin spin-item"></i>',
            '<em>{0}</em>'.exFormat(content || '数据查询中...'),
            '</div>'
        ];
        $dom.each(function () {
            var $thiz = $(this),
                oPosition = $thiz.css('position'),
                $wrap = $('<div class="iot-spinner-wrapper" hidden></div>').appendTo($thiz);
            if (oPosition === 'static') {
                $thiz.css('position', 'relative').attr('data-iot-position', oPosition);
            }
            $thiz.children().wrapAll($wrap);
            $thiz.append(tempArr.join(''));
        });
        return this;
    },
    /**
     * 隐藏蒙层效果（内联样式）
     * @param $dom
     */
    hideInlineOverlay: function ($dom) {
        $dom.each(function () {
            var $thiz = $(this),
                oPosition = $thiz.attr('data-iot-position'),
                $spin = $thiz.find('.e-spin-wrap');
            $spin.fadeOut(function () {
                $spin.remove();
                $thiz.css('position', oPosition);
                $thiz.find('.iot-spinner-wrapper').children().unwrap();
            });
        });
        return this;
    }
};