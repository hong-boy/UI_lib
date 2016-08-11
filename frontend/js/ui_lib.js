'use strict';
$(function () {
    (function ($) {
        var DATA_TAG = 'accordion';
        var defaults = {
            maxDeep: 3, //最大支持3层
            minHeight: 'auto', //最小高度
            cancelBubble: true, //取消自定义click事件的冒泡
            exclusive: true, //只允许一个子菜单处于展开状态
            hideBorder4LastItem: true, //隐藏最后一个叶子节点的border
            data: [] //形如：[{id:'', clazz:'', label:'', click:'', expand:true, childs: []}]，支持三层
        };
        var generateDom = function ($wrap, data, option, deep) {
            if (deep > option.maxDeep) {
                $wrap.remove();
                return;
            }
            var isLeaf = true, $menu = $('<div class="sub-menu"></div>');
            if (deep === 1) {
                isLeaf = false;
                $menu.removeClass().addClass('menu');
            }
            $.each(data, function (i, item) {
                var $li = $('<div class="item"></div>'),
                    $label = $('<span class="item-label"></span>').appendTo($li),
                    tid = item['id'],
                    clazz = item['clazz'],
                    childs = item['childs'],
                    handler = item['click'],
                    isExpand = !!item['expand'];
                (tid || $.isNumeric(tid)) && $li.attr('id', tid);
                (clazz || $.isNumeric(clazz)) && $li.addClass(clazz);
                $.isFunction(handler) && $label.click(function (e) {
                    handler(e);
                    return !option.cancelBubble;
                });
                $label.html(item['label']);
                $menu.append($li).appendTo($wrap);
                if (childs && childs.length) {
                    isLeaf = false;
                    $li.addClass('has-sub-item');
                    isExpand && $li.removeClass('collapsed').addClass('expanded');
                    !isExpand && $li.removeClass('expanded').addClass('collapsed');
                    var $subItem = $('<div class="item sub-item"></div>').appendTo($menu);
                    generateDom($subItem, childs, ++deep);
                }
                if (isLeaf) {
                    $wrap.addClass('leaf-item');
                }
            });
        };
        var bindEvent = function (wrap) {
            //bind collapsed
            wrap.off('click.collapsed', '.has-sub-item')
                .on('click.collapsed', '.has-sub-item', function (e) {
                    var $thiz = $(this),
                        $parent = $thiz.parents('.accordion'),
                        option = $parent.data(DATA_TAG) || {},
                        delay = '400';
                    var collapseFunc = function (dom, done) {
                        dom.animate({
                            height: '0px'
                        }, delay, done);
                    };
                    var expandFunc = function (dom, done) {
                        var height = dom.find('.sub-menu').height();
                        dom.animate({
                            height: [height, 'px'].join('')
                        }, delay, done);
                    };
                    if ($thiz.hasClass('collapsed')) {//expand
                        if (option.exclusive) {
                            $parent.find('.expanded').each(function () {
                                collapseFunc($(this).next('.sub-item'), function () {
                                    $(this).removeClass('expanded').addClass('collapsed');
                                }.bind(this));
                            });
                        }
                        expandFunc($thiz.next('.sub-item'), function () {
                            $thiz.removeClass('collapsed').addClass('expanded');
                        });
                    } else {//collapsed
                        collapseFunc($thiz.next('.sub-item'), function () {
                            $thiz.removeClass('expanded').addClass('collapsed');
                        });
                    }
                });
        };
        var renderWrapperStyle = function (dom, option) {
            //minHeight
            var minHeight = option.minHeight;
            minHeight = $.isNumeric(minHeight) ? [minHeight, 'px'].join('') : minHeight;
            dom.css('min-height', minHeight);
            //hideBorder4LastItem
            option.hideBorder4LastItem && dom.css('border-bottom', 'none');
            //exclusive
            if (option.exclusive) {
                dom.find('.expanded').filter(function (i) {
                    (i > 0) && $(this).removeClass('expanded').addClass('collapsed');
                });
            }
        };
        var storeData = function (wrap, option) {
            wrap.data(DATA_TAG, option);
        };
        var methods = {
            init: function (dom, option) {
                option = $.extend(true, {}, defaults, option);
                var $wrap = $('.accordion', dom);
                $wrap.length || ($wrap = $('<div class="accordion"></div>'));
                generateDom($wrap.empty(), option.data, option, 1);
                storeData($wrap, option);
                bindEvent($wrap);
                renderWrapperStyle($wrap, option);
                return dom.append($wrap);
            }
        };
        $.fn.accordion = function (method, option) {
            return methods[method].call(null, $(this).first(), option);
        };
    })(jQuery);
    var menus = [
        {label: '文字/颜色/图标', click: null},
        {
            label: '基础组件', expand: true, childs: [
            {label: '按钮', click: null},
            {label: '单选、复选', click: null},
            {label: '下拉列表', click: null},
            {label: '时间日期', click: null},
            {label: '文本输入', click: null},
            {label: '文本上传', click: null},
            {label: '条件查询', click: null},
            {label: '表单', click: null},
            {label: '消息', click: null}
        ]
        },
        {
            label: '容器', expand: true, childs: [
            {label: '页签', click: null},
            {label: '窗口', click: null}
        ]
        },
        {
            label: '导航', childs: [
            {label: '菜单', click: null},
            {label: '向导', click: null},
            {label: '手风琴', click: null},
            {label: '树', click: null}
        ]
        },
        {
            label: '表格', childs: [
            {label: '数据/操作/分页', click: null},
            {label: '纯文本数据', click: null}
        ]
        }
    ];
    $('#menu').accordion('init', {data: menus});
});
