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

/**
 * 菜单widget
 */
(function ($) {
    var DATA_TAG = 'menuWidget';
    var BG_DATA_TAG = 'bgElementTag';
    var DEFAULTS = {
        ns: 'menu_widget', //命名空间
        driven: 'dom', //插件的驱动方式：DOM和JS，目前只支持DOM驱动
        bgElementContainer: null, //背景所依附的元素
        bgElementClazz: '', //背景元素的class属性
        autoHide: true, //点击菜单项后，子菜单自动关闭
        onShow: null, //子菜单显示时的回调
        onHide: null, //子菜单隐藏时的回调
        onComplete: null //菜单生成/更新后的回调
//        data: [] //菜单项，形如: [{id:'system_manage', label:'系统管理', click:null, active: true, attributes: ['module-menu=/systemManage'], children: []}]
    };
    /**
     * 生成背景元素
     * 若指定bgElementContainer元素，则在该容器下生成；
     * 否则，在.iot-menu-wrapper容器下生成
     * @param $wrap
     * @param option
     */
    var genBackgroundElement = function ($wrap, option) {
        var $bg = $wrap.find('.iot-menu-bg'),
            $bgContainer = $(option.bgElementContainer);
        if (!$bg.length) {
            $bg = $('<div class="hide iot-menu-bg"></div>');
            if ($bgContainer.length && $bgContainer.find($wrap).length) {
                var pos = $bgContainer.css('position');
                (pos === 'static') && $bgContainer.css('position', 'relative');
                $bg.appendTo($bgContainer).css({
                    'position': 'absolute',
                    'z-index': 10,
                    'width': $bgContainer.css('width'),
                    'background-color': 'rgba(80, 76, 77, 0.8)'
                });
            } else {
                $bg.appendTo($wrap);
            }
        }
        $bg.addClass(option.bgElementClazz);
        return $bg;
    };

    var methods = {
        init: function ($thiz, option, promise) {
            //为一级菜单的每个元素项(li)绑定hover事件
            //<div class="iot-menu-list-item-bg"></div>
            $thiz.find('.iot-menu-navbar').prepend('<div class="iot-menu-list-item-bg"></div>');
            $thiz.data(DATA_TAG, option);
            $thiz.data(BG_DATA_TAG, genBackgroundElement($thiz, option));
            $thiz.off('mouseenter', '.iot-menu-list-item')
                .on('mouseenter', '.iot-menu-list-item', $thiz, function (e) {
                    var $wrap = e.data,
                        option = $wrap.data(DATA_TAG),
                        $this = $(this),
                        $subMenu = $this.find('.iot-sub-menu-wrapper'),
                        $listItemBg = $wrap.find('.iot-menu-list-item-bg'),
                        $bg = $wrap.data(BG_DATA_TAG),
                        bgHeight;
                    //calculate sub-menu
                    var adjustLeft = $this.data('menuwidgetLeft');
                    var adjustWidth = $this.data('menuwidgetWidth');
                    var adjustHeight = $this.data('menuwidgetHeight');
                    $.isNumeric(adjustLeft) && $subMenu.css('left', adjustLeft);
                    $.isNumeric(adjustWidth) && $subMenu.css('width', adjustWidth);
                    $.isNumeric(adjustHeight) && $subMenu.css('height', adjustHeight);
                    //show sub-menu
                    bgHeight = $subMenu.css('opacity', 0).removeClass('hide').height();
                    //calculate bg container
                    $bg.height(bgHeight).removeClass('hide');
                    $subMenu.css('opacity', 1);
                    //calculate item bg position
                    var pos = $this.position();
                    pos.width = $this.outerWidth();
                    $listItemBg.css(pos);
                    //onShow
                    $.isFunction(option.onShow) && option.onShow($this);
                });
            $thiz.off('mouseleave', '.iot-menu-list-item')
                .on('mouseleave', '.iot-menu-list-item', $thiz, function (e) {
                    var $wrap = e.data,
                        option = $wrap.data(DATA_TAG),
                        $this = $(this),
                        $activeItem = $wrap.find('.iot-menu-list-item.active'),
                        $listItemBg = $wrap.find('.iot-menu-list-item-bg'),
                        $bg = $wrap.data(BG_DATA_TAG);
                    $this.find('.iot-sub-menu-wrapper').addClass('hide');
                    $bg.addClass('hide');
                    //calculate item bg position
                    var pos = $activeItem.position();
                    pos.width = $this.outerWidth();
                    $listItemBg.css(pos);
                    //onHide
                    $.isFunction(option.onHide) && option.onHide($this);
                });
            //为菜单绑定click事件
            $thiz.off('click.menu', '.iot-sub-menu-wrapper span.iot-sub-menu-item')
                .on('click.menu', '.iot-sub-menu-wrapper span.iot-sub-menu-item', $thiz, function (e) {
                    var $wrap = e.data,
                        option = $wrap.data(DATA_TAG),
                        $this = $(this),
                        $parentSubList = $this.parents('.iot-sub-menu-list-item'),
                        $parentList = $this.parents('.iot-menu-list-item');
                    $wrap.find('.active').removeClass('active');
                    $this.addClass('active');
                    $parentSubList.addClass('active');
                    $parentList.addClass('active');
                    if (option.autoHide) {
                        $parentList.trigger('mouseleave');
                    }
                });
            //为一级菜单绑定click事件
            $thiz.off('click.menu', '.iot-menu-list-item[data-menuwidget-clickable]')
                .on('click.menu', '.iot-menu-list-item[data-menuwidget-clickable]', $thiz, function (e) {
                    if (e.target.className && e.target.className.indexOf('iot-sub-menu-item') === -1) {
                        var $wrap = e.data,
                            option = $wrap.data(DATA_TAG),
                            $this = $(this);
                        $wrap.find('.active').removeClass('active');
                        $this.addClass('active');
                        if (option.autoHide) {
                            $this.trigger('mouseleave');
                        }
                    }
                });
            setTimeout(function () {
                promise.resolve($thiz);
            }, 1);
            return promise;
        }
    };
    $.fn.menuWidget = function (method, option) {
        if (!$.isFunction(methods[method])) {
            throw 'Method[' + (method) + '] is not a function!';
        }
        var original = $(this).data(DATA_TAG);
        var dtd = $.Deferred();
        option = $.extend(true, {}, DEFAULTS, original, option);
        $.when(methods[method].call(methods, $(this), option, dtd))
            .done(function ($dom) {
                var pos = $dom.find('.iot-menu-list-item.active').position();
                $dom.find('.iot-menu-list-item-bg').css(pos);
            })
            .done(function ($dom) {
                var option = $dom.data(DATA_TAG),
                    $bg = $('.iot-menu-bg'),
                    bgOffsetTop = {top: $dom.offset().top + $dom.height()};
                $bg.css('opacity', 0).removeClass('hide').offset(bgOffsetTop).addClass('hide').css('opacity', 1);
                $.isFunction(option.onComplete) && option.onComplete($dom);
            })
            .fail(function ($dom, err) {
                console.error(err);
            });
    };
})(jQuery);

/**
 * $.fn.simpleResizable
 * @dependency $.fn.draggable | fontello
 */
(function ($) {
    var DATA_TAG = 'simpleResizer';
    var CURRENT_STATUS_TAG = 'simpleResizerStatus';
    var RESTORE_CSS_STATUS = 'restoreCssStatus';
    var MINIMIZE_CSS_STATUS = 'minCssStatus';
    var ANIMATION_SPEED = 'fast';
    var ZINDEX_COUNTER = 10; //定义对话框的层级
    var ORIGINAL_ZINDEX_TAG = 'originalZIndexTag';
    var STATUS_ENUM = {
        MIN: 1,
        RESTORE: 2,
        FULLSCREEN: 3
    };
    var DEFAULTS_DRAGGABLE = {//draggable option
        cursor: 'move'
    };
    var DEFAULTS = {
        initilizeStatus: 1, //初始状态：minimize | restore | fullscreen
        alwaysShowAllIcons: false, //是否同时显示"最小化"和"还原"按钮
        zIndex: 9999, //窗口处于focus状态时的层级
        minimize: {//最小化
            icon: 'icon-win-min', //图标
            iconPosition: {left: '', top: '', right: '', bottom: ''}, //图标位置，形如：{left:'', top:'', right:'', bottom:''}
            iconTooltip: '最小化', //title信息
            position: 'SE:50px:50px', //窗口显示位置，形如：'SE:VAL_1:VAL_2'，其中SE表示方向(SouthEast)，VAL_1:表示相对于South方向的偏移，VAL_2:表示相对于East方向的偏移
            width: '',
            height: '',
            draggable: false, //是否可拖动
            dragHandler: null //拖动句柄
        },
        restore: {//还原
            icon: 'icon-win-restore', //图标
            iconPosition: {left: '', top: '', right: '', bottom: ''}, //图标位置
            iconTooltip: '还原', //title信息
            position: 'SE',
            width: '',
            height: '',
            draggable: false, //是否可拖动
            dragHandler: null //拖动句柄
        },
        onMinimize: $.noop, //最小化回调(必须实现)，形如：function($wrap, option){}
        onRestore: $.noop, //还原时回调 形如：function($wrap, option){}
        onComplete: $.noop //初始化完毕时回调
    };

    var UI = {
        /**
         * 创建容器
         * @param $dom 待包装对象
         * @param option
         * @returns {jQuery} 形如：
         *  <div class="iot-resizable-wrapper">
         *      <div class="iot-resizable-status-restore"></div>
         *      <div class="iot-resizable-status-min"></div>
         *      <div class="iot-resizable-icon"></div>
         * </div>
         */
        createResizer: function ($dom, option) {
            var $resizeWrap = $dom.parent(),
                $parent = $resizeWrap,
                targetCSS,
                zIndex = $dom.css('zIndex');

            if (!$resizeWrap.hasClass('iot-resizable-wrapper')) {
                //Update parent's position firstly
                if ($parent.css('position') === 'static') {
                    $parent.css('position', 'relative');
                }
                $resizeWrap = $('<div class="iot-resizable-wrapper"></div>');
                //Cache restored view style
                var restoreViewStyle = UI.genRestoreViewStyle($resizeWrap, $dom, $parent, option);
                $resizeWrap.data(RESTORE_CSS_STATUS, restoreViewStyle);
                //Clear useless status for $dom
                $dom.css({
                    'margin': 'auto',
                    'left': 'auto',
                    'right': 'auto',
                    'bottom': 'auto',
                    'top': 'auto'
                }).addClass('iot-resizable-status-restore');

                //Cache mini view style
                var minViewStyle = UI.genMinViewStyle($resizeWrap, option);
                $resizeWrap.data(MINIMIZE_CSS_STATUS, minViewStyle);

                if (option.initilizeStatus == STATUS_ENUM.MIN) {//初始视图
                    $resizeWrap.find('.iot-resizable-status-restore').hide();
                    $resizeWrap.find('.iot-resizable-status-min').show();
                    targetCSS = minViewStyle;
                } else {
                    $resizeWrap.find('.iot-resizable-status-restore').show();
                    $resizeWrap.find('.iot-resizable-status-min').hide();
                    targetCSS = restoreViewStyle;
                }
                zIndex = zIndex === 'auto' ? ZINDEX_COUNTER++ : zIndex;
                $resizeWrap.data(CURRENT_STATUS_TAG, option.initilizeStatus)
                    .data(ORIGINAL_ZINDEX_TAG, zIndex)
                    .css(targetCSS)
                    .css('zIndex', zIndex)
                    .show();
            }
            return $resizeWrap;
        },
        /**
         * 生成"还原窗口"视图样式
         * @param $wrap
         * @param option
         */
        genRestoreViewStyle: function ($wrap, $dom, $parent, option) {
            //Get original status of $dom. Use restore status as default
            $dom.css('opacity', 0).show();
            var restore = option.restore,
                direction = option.minimize.position.split(':')[0],
                originalWidth = restore.width || $dom.outerWidth(),
                originalHeight = restore.height || $dom.outerHeight(),
                restorePos = restore.position || direction,
                originalPos = UI.handlePosition(restorePos, $dom);

            //Create wrapper & icon
            $wrap.append($dom).appendTo($parent).hide();
            $dom.css('opacity', 1);
            $('<div class="iot-resizable-status-min"></div>').appendTo($wrap);
            $('<div class="iot-resizable-icon"></div>').appendTo($wrap);
            //Calculate wrapper style
            var targetCSS = {
                width: originalWidth,
                height: originalHeight
            };
            return $.extend(true, targetCSS, originalPos);
        },
        /**
         * 生成"最小化"视图样式
         * @param $wrap
         * @param option
         * @returns {*}
         */
        genMinViewStyle: function ($wrap, option) {
            var $minArea = $wrap.find('.iot-resizable-status-min'),
                html = option.onMinimize($wrap, option),
                $html = $(html),
                minimizePos = option.minimize.position,
                targetCSS,
                minAreaHeight,
                minAreaWidth;

            $minArea.hide().css('opacity', 0).empty().append($html).show();
            minAreaWidth = option.minimize.width;
            minAreaHeight = option.minimize.height;
            targetCSS = {
                width: minAreaWidth,
                height: minAreaHeight
            };
            $minArea.css('opacity', 1);
            return $.extend(true, targetCSS, UI.handlePosition(minimizePos, undefined));
        },
        /**
         * 创建图标按钮
         * @param $wrap
         * @param option
         */
        createIcon: function ($wrap, option) {
            var $iconWrap = $wrap.find('> .iot-resizable-icon'),
                minIconObj = option.minimize,
                restoreIconObj = option.restore,
                $minIcon = $('<span class="icon iot-icon-resize-min ' + (minIconObj.icon) + '"></span>'),
                $restoreIcon = $('<span class="icon iot-icon-resize-restore ' + (restoreIconObj.icon) + '"></span>');

            var renderIcon = function (dom, iconObj) {
                var resetParentStyle = function (dom, targetCss, position) {
                    $.each(position, function (key, val) {
                        if (isNaN(parseInt(val))) {
                            dom.css(key, '');//clear
                        } else {
                            targetCss[key] = val;
                        }
                    });
                    return targetCss;
                };
                var targetCSS = resetParentStyle(dom, {}, iconObj.iconPosition || {});
                !$.isEmptyObject(targetCSS) && dom.css(targetCSS);
                iconObj.iconTooltip && dom.attr('title', iconObj.iconTooltip);
            };

            renderIcon($minIcon, minIconObj);
            renderIcon($restoreIcon, restoreIconObj);

            $iconWrap.append($minIcon).append($restoreIcon);
        },
        bindEvent: function ($wrap, option) {
            //最小化
            $wrap.off('click', '.iot-icon-resize-min').on('click', '.iot-icon-resize-min', function (e) {
                var $thiz = $(this),
                    $parent = $thiz.parents('.iot-resizable-wrapper'),
                    $restoreIcon = $parent.find('.iot-icon-resize-restore');
                if ($parent.data(CURRENT_STATUS_TAG) == STATUS_ENUM.MIN) {
                    return;
                }
                var option = $parent.data(DATA_TAG),
                    miniPos = option.minimize.position,
                    $minArea = $parent.find('.iot-resizable-status-min'),
                    $restoreArea = $parent.find('.iot-resizable-status-restore'),
                    html = option.onMinimize($parent, option),
                    targetCSS = $parent.data(MINIMIZE_CSS_STATUS);

                $minArea.empty().append(html);
                if (option.minimize.draggable) {
                    $parent.draggable('option', 'handle', option.minimize.dragHandler);
                }
                !option.alwaysShowAllIcons && $thiz.hide();
                $parent.animate(targetCSS, ANIMATION_SPEED, function () {
                    $restoreArea.hide();
                    $minArea.css('opacity', 1).show();
                    $parent.data(CURRENT_STATUS_TAG, STATUS_ENUM.MIN);
                    !option.alwaysShowAllIcons && $restoreIcon.fadeIn();
                });
            });

            //窗口还原
            $wrap.off('click', '.iot-icon-resize-restore').on('click', '.iot-icon-resize-restore', function (e) {
                var $thiz = $(this),
                    $parent = $thiz.parents('.iot-resizable-wrapper'),
                    $minIcon = $parent.find('.iot-icon-resize-min'),
                    originalCssStatus = $parent.data(RESTORE_CSS_STATUS);

                if ($parent.data(CURRENT_STATUS_TAG) == STATUS_ENUM.RESTORE) {
                    return;
                }
                var option = $parent.data(DATA_TAG),
                    $minArea = $parent.find('.iot-resizable-status-min'),
                    $restoreArea = $parent.find('.iot-resizable-status-restore');

                if (option.restore.draggable) {
                    $parent.draggable('option', 'handle', option.restore.dragHandler);
                }
                !option.alwaysShowAllIcons && $thiz.hide();
                $parent.animate(originalCssStatus, ANIMATION_SPEED, function () {
                    $minArea.hide();
                    $restoreArea.show();
                    $parent.data(CURRENT_STATUS_TAG, STATUS_ENUM.RESTORE);
                    $.isFunction(option.onRestore) && option.onRestore($parent, option);
                    !option.alwaysShowAllIcons && $minIcon.fadeIn();
                });
            });
        },
        /**
         * 计算偏移
         * @param position
         * @param dom
         * @returns {{}}
         */
        handlePosition: function (position, dom) {
            var result = {},
                arr = position.split(':');
            switch (arr[0]) {
                case 'SE':
                {
                    result.bottom = arr[1] || dom.css('bottom');
                    result.right = arr[2] || dom.css('right');
                    break;
                }
                case 'NE':
                {
                    result.top = arr[1] || dom.css('top');
                    result.right = arr[2] || dom.css('right');
                    break;
                }
                case 'NW':
                {
                    result.top = arr[1] || dom.css('top');
                    result.left = arr[2] || dom.css('left');
                    break;
                }
                case 'SW':
                {
                    result.bottom = arr[1] || dom.css('bottom');
                    result.left = arr[2] || dom.css('left');
                    break;
                }
                default:
                {
                    throw 'Position[' + (position) + '] is illegal!';
                }
            }
            return result;
        }
    };

    var methods = {
        init: function ($dom, option, promise) {
            var dtd = $.Deferred();
            option = $.extend(true, {}, DEFAULTS, option);
            $.when(function ($dom, option, dtd) {
                    var $wrap = UI.createResizer($dom, option);
                    UI.createIcon($wrap, option);
                    UI.bindEvent($wrap, option);
                    $wrap.fadeIn(function () {
                        dtd.resolve($wrap);
                    });
                    return dtd;
                }($dom, option, dtd))
                .done(function ($wrap) {
                    //Cache option and reset icons' style
                    $wrap.data(DATA_TAG, option);
                    if (!option.alwaysShowAllIcons) {
                        if (option.initilizeStatus == STATUS_ENUM.MIN) {
                            $wrap.find('.iot-icon-resize-min').hide();
                        } else {
                            $wrap.find('.iot-icon-resize-restore').hide();
                        }
                    }
                })
                .done(function ($wrap) {
                    //Darggable check
                    var minimize = option.minimize,
                        restore = option.restore,
                        handler = (option.initilizeStatus == STATUS_ENUM.MIN) ? minimize.dragHandler : restore.dragHandler;
                    var updateZIndex = function ($dom) {
                        var option = $dom.data(DATA_TAG),
                            $parent = $dom.parent();
                        $parent.find('.iot-resizable-wrapper').not($dom).each(function () {
                            var $thiz = $(this);
                            $thiz.css('z-index', $thiz.data(ORIGINAL_ZINDEX_TAG));
                        });
                        $dom.css('z-index', option.zIndex);
                    };
                    var dragStart = function (e, ui) {
                        updateZIndex(ui.helper);
                    };
                    var dragStop = function (e, ui) {
                        var $dom = ui.helper,
                            $parent = $dom.parent(),
                            dWidth = $dom.width(),
                            dHeight = $dom.height(),
                            pWidth = $parent.width(),
                            pHeight = $parent.height(),
                            uiPosition = ui.position,
                            option = $dom.data(DATA_TAG),
                            minimize = option.minimize,
                            direction = minimize.position.split(':')[0];
                        if (direction === 'NE') {
                            $dom.css({
                                right: pWidth - (dWidth + uiPosition.left),
                                left: ''
                            });
                        } else if (direction === 'SE') {
                            $dom.css({
                                right: pWidth - (dWidth + uiPosition.left),
                                bottom: pHeight - (dHeight + uiPosition.top),
                                left: '',
                                top: ''
                            });
                        } else if (direction === 'SW') {
                            $dom.css({
                                bottom: pHeight - (dHeight + uiPosition.top),
                                top: ''
                            });
                        } else {
                            //do nothing
                        }
                    };
                    $wrap.attr('tabIndex', -1).focusin(function () {
                        updateZIndex($(this));
                    });
                    (minimize.draggable || restore.draggable) && $wrap.draggable(
                        $.extend(true, DEFAULTS_DRAGGABLE, {
                            handle: handler,
                            containment: $wrap.parent(),
                            stop: dragStop,
                            start: dragStart
                        })
                    );
                })
                .done(function ($wrap) {
                    $.isFunction(option.onComplete) && option.onComplete($wrap);
                    promise.resolve($wrap);
                });
            return promise;
        },
        trigger: function ($wrap, action, promise) {
            var flag = true;
            switch (action) {
                case 'minimize':
                {
                    $wrap.find('.iot-icon-resize-min').trigger('click');
                    break;
                }
                case 'restore':
                {
                    $wrap.find('.iot-icon-resize-restore').trigger('click');
                    break;
                }
                default:
                {
                    flag = false;
                    break;
                }
            }
            setTimeout(function () {
                flag && promise.resolve($wrap);
                !flag && promise.reject($wrap, new Error('Action[%s] is illegal!', action));
            }, 0);
            return promise;
        }
    };
    $.fn.simpleResizable = function (method, option) {
        if (!$.isFunction(methods[method])) {
            throw new Error('Method[%s] is not supported!', method);
        }
        var dtd = $.Deferred();
        $.when(methods[method].call(null, $(this), option, dtd))
            .fail(function ($wrap, error) {
                console.error(error);
            });
    };
})(jQuery);

/**
 * 文件上传
 * window.FileUploader
 */
(function (window, $, undefined) {
    var DEFAULTS = {
        label: '', //file控件的label，false表示不显示
        labelClass: '',
        chooseBtn: '…', //选择文件按钮，false表示不显示
        chooseBtnClass: '',
        uploadBtn: '上传',
        uploadBtnClass: '',
        allowedExtends: [], //允许的文件扩展名
        notAllowedExtends: [], //不允许的文件扩展名
        maxFileSize: '2M', //单个文件长度限制
        status: {//状态
            show: true, //是否显示提示信息
            normal: {msg: '文件支持类型：{allowedExtends}，单个文件大小不超过：{maxFileSize}', icon: 'icon-warning warning-text'},
            progress: {
                msg: '正在上传... 已上传：{uploadedFileSize}，当前进度：{percent}',
                icon: 'icon-loading',
                showCancel: true,
                showDelete: true
            },
            error: {msg: '上传失败！', icon: 'icon-error error-text', showRetry: true, showCancel: true, showDelete: true},
            success: {msg: '上传成功！', icon: 'icon-error error-text', showDelete: true}
        }
    };
    window.FileUploader = function (dom, option) {
        if (!(dom instanceof $)) {
            throw 'dom should be an instance of jQuery!';
        }
        this.dom = dom;
        this.option = $.extend(true, DEFAULTS, option);
    };

    var createFileControl = function () {

    };

    //初始化控件
    FileUploader.prototype.init = function () {
        var dom = this.dom;

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
        dialog.getModal().css('justify-content', 'center');
        dialog.getModalDialog().addClass('clearfix');
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
    },
    /**
     * 获取datatables配置对象
     * @param sAjaxSource{String|Object} 路由地址
     * @param aoColumns{Array} 显示列
     * @param extraParams{Function} 需要传递到后端的额外参数
     * @param fnDrawCallback{Function} dataTables每次渲染完数据后的回调函数（翻页、没有数据时均会触发）
     */
    dataTableOption: function (sAjaxSource, aoColumns, extraParams, fnDrawCallback) {
        var option = {},
            defaultOpt = {
                "dom": 't<"tbl-bottom"ip>',
                "processing": false,
                "ordering": false,
                "searching": false,
                "info": true,
                "lengthChange": false,
                "iDisplayLength": 10, //: 每页的行数，每页默认数量:10
                "bPaginate": true, //开关，是否显示分页器
                "bServerSide": true,
                fnDrawCallback: null,
                "oLanguage": {
                    "sProcessing": '<i class="icon-spin5 animate-spin spin-item"></i>数据查询中......',
                    "sZeroRecords": "对不起，查询不到相关数据！",
                    "sEmptyTable": "表中无数据存在！",
                    "sInfo": '总共: _TOTAL_ 项 &nbsp; 每页: _LENGTH_ 项',
                    "sInfoEmpty": '总共: _TOTAL_ 项',
                    "oPaginate": {
                        "sPrevious": '<span class="png png-prev"></span>',
                        "sNext": '<span class="png png-next" ></span>'
                    }
                }
            },
            _fnDrawCallback = null;
        if ($.isPlainObject(sAjaxSource)) {
            option = sAjaxSource;
        } else {
            option = {
                sAjaxSource: sAjaxSource,
                aoColumns: aoColumns,
                fnDrawCallback: fnDrawCallback || $.noop,
                fnServerData: function (sSource, aoData, fnCallback) {
                    var oDraw = aoData[0],
                        oStart = aoData[3],
                        oLength = aoData[4],
                        param = {
                            pageNum: (oStart.value / oLength.value + 1),
                            pageSize: oLength.value
                        };
                    IOT.getServerData(sSource, $.extend(param, $.isFunction(extraParams) ? extraParams() : {}), function (data) {
                        IOT.renderDataTableData(oDraw.value, data, fnCallback);
                    });
                }
            };
        }
        if (!option.sAjaxSource || !option.sAjaxSource.length) {
            throw Error('Field [sAjaxSource] is required.');
        }
        var opts = $.extend(true, {}, defaultOpt, option);
        _fnDrawCallback = opts.fnDrawCallback || $.noop;
        opts.fnDrawCallback = function () {
            _fnDrawCallback();
        };
        return opts;
    }
};