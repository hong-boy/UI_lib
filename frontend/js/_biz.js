'use strict';
$(function () {
    //基础组件 - 滑动按钮
    var uOption = {
        ns: 'cust_ns',
        chkID: 'chk_5',
        chkClazz: 'cust-chk5',
        checked: true,
        disabled: false,
        minWidth: '140px',
        labels: ['开', '关'],
        changed: null
    };
    $('#slide_btn_wrap1').slideBtn('refresh', uOption);
    var option = {
        ns: 'cust_ns',
        chkID: 'chk_2',
        chkClazz: 'cust-chk',
        checked: false,
        disabled: false,
        minWidth: '140px',
        labels: ['开阀', '关阀'],
        changed: null
    };
    $('#slide_btn_wrapper').slideBtn('init', option);
    //基础组件 - 带加载效果的按钮
    $('#btn_load, #btn_load1, #btn_load2').click(function () {
        $(this).spinner('create').spinner('start');
        setTimeout(function () {
            $(this).spinner('stop');
        }, 300000);
        return false;
    });

    // - 单选、复选
    $('#chk_radio_wrap input:radio').iCheck({
        radioClass: 'iradio_normal',
        labelHover: false
    });
    $('#chk_radio_wrap input:checkbox').iCheck({
        checkboxClass: 'icheckbox_normal',
        labelHover: false
    });

    //下拉列表 - 单选
    $('#single_dropdown').selectpicker();
    //下拉列表 - 多选
    $('#multi_drowdown').selectpicker();
    $('#multi1_drowdown').selectpicker();
    $('#multi2_drowdown').selectpicker();
    $('#multi3_drowdown').selectpicker();


    //时间日期
    $.datetimepicker.setLocale('zh');
    $('#my_date').datetimepicker({
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    });

    //消息提示
    $('#succ_msg_btn').unbind('click').bind('click', function () {
        IOT.tips('重置密码成功，新密码已下发至联系人邮箱...', 'success', 3000, function () {
            console.log('hidden...');
        });
    });
    $('#error_msg_btn').unbind('click').bind('click', function () {
        IOT.tips('重置密码失败，请稍后再试...', 'error', 3000, function () {
            console.log('hidden...');
        });
    });

    //蒙层
    $('#btn_overlay').unbind('click').bind('click', function () {
        var inst = new IOTLoading({
            theme: IOTLoading.THEME_SIMPLE,
            content: '10秒后，我会自动消失...',
            parent: '#overlay_wrap',
            //overlay: false
        });
        inst.show();
        setTimeout(function () {
            inst.hide();
        }, 10000);
    });
    $('#btn_overlay2').unbind('click').bind('click', function () {
        IOT.showOverlay('10秒后我会消失...');
        setTimeout(function () {
            IOT.hideOverlay();
        }, 10000);
    });
    $('#btn_overlay3').unbind('click').bind('click', function () {
        var inst = new IOTProgressbar();
        inst.show();
        inst.updateProgress(20);
        var $thiz = $(this);
        clearInterval($thiz.data('timer'));
        var progress = 30;
        var timer = setInterval(function () {
            if (progress > 100) {
                clearInterval($thiz.data('timer'));
                inst.hide();
            }
            inst.updateProgress(progress);
            progress += 10;
        }, 3000);
        $(this).data('timer', timer);
    });
    $('#btn_overlay4').unbind('click').bind('click', function () {
        var inst = new IOTProgressbar({
            parent: '#overlay_wrap'
        });
        inst.show();
        inst.updateProgress(20);
        var $thiz = $(this);
        clearInterval($thiz.data('timer'));
        var progress = 30;
        var timer = setInterval(function () {
            if (progress > 100) {
                clearInterval($thiz.data('timer'));
                inst.hide();
            }
            inst.updateProgress(progress);
            progress += 10;
        }, 3000);
        $(this).data('timer', timer);
    });
});

$(function () {
    // 表单 - 水平表单
    $('.form-wrap input:radio').iCheck({
        radioClass: 'iradio_normal',
        labelHover: false
    });
    $('.form-wrap input:checkbox').iCheck({
        checkboxClass: 'icheckbox_normal',
        labelHover: false
    });
    $('#single_sel').selectpicker();
    //初始化textarea
    $('#textarea').charCount();
    //表单验证
    $('#my_form, #my_inline_form').validationEngine({
        //autoHidePrompt: false,
        onFieldFailure: function (field) {

        },
        onFieldSuccess: function (field) {

        },
        onValidationComplete: function (form, valid) {
            if (valid) {
                IOT.tips('表单验证成功！', 'success');
            } else {
                IOT.tips('表单验证失败！', 'error');
            }
            return false;
        }
    });
    //时间日期
    $.datetimepicker.setLocale('zh');
    $('#s_time, #e_time, #s1_time, #e1_time').datetimepicker({
        format: 'Y-m-d',
        formatDate: 'Y-m-d',
        timepicker: false
    });
});

$(function () {
    //弹出层
    $('#dialog_1').unbind('click').bind('click', function () {
        var btns = [{
            text: '确 定',
            hotkey: null,
            enabled: true,
            click: function (dialog) {
                console.log('confirm');
            }
        }, {
            text: '取 消',
            clazz: 'btn-empty',
            hotkey: 27,
            enabled: true,
            click: function (dialog) {
                dialog.close();
            }
        }];
        IOT.displayDefaultDialog('编辑用户', 'some content here...', 500, 300, btns);
    });
    $('#dialog_2').unbind('click').bind('click', function () {
        IOT.confirm('确认要删除该用户吗？', function (dialog) {
            console.log('confirm...')
        }, function (dialog) {
            dialog.close();
        });
    });

    //菜单
    $('.iot-menu-wrapper').menuWidget('init', {
        bgElementContainer: '.menu-wrap'
    });

    //Resizable
    //$('#my_resizer').resizable({
    //    handles : "n,e,se,all",
    //    helper : false,
    //    helperStyle : {
    //        "border" : "0px solid #888",
    //        "border-bottom" : "5px solid #888"
    //    },
    //    maxHeight : 600,
    //    maxWidth : 600,
    //    minHeight : 10,
    //    minWidth : 10,
    //    onStartResize : function() {
    //    },
    //    onResize : function() {
    //    },
    //    onStopResize : function() {
    //    }
    //});

    $('#my_target').simpleResizable('init', {
        initilizeStatus: 2,
        minimize: {
            position: 'NW:50px:0',
            width: '200px',
            height: '25px',
            draggable: true,
            dragHandler: '.my-min-view'
        },
        restore: {
            position: 'NW',
            draggable: true,
            dragHandler: '.bootstrap-dialog-title'
        },
        onMinimize: function () {
            return '<div class="my-min-view" style="background-color:#00d4b4">车辆信息列表</div>';
        }
    });
    $('#my_target1').simpleResizable('init', {
        initilizeStatus: 2,
        minimize: {
            position: 'SW:50px:0',
            width: '200px',
            height: '25px',
            draggable: true,
            dragHandler: '.my-min-view'
        },
        restore: {
            position: 'SW:0:10px',
            draggable: true,
            dragHandler: '.bootstrap-dialog-header'
        },
        onMinimize: function () {
            return '<div class="my-min-view" style="background-color:#00d4b4">车辆信息列表1</div>';
        }
    });
    $('#my_target2').simpleResizable('init', {
        initilizeStatus: 2,
        minimize: {
            position: 'SE:50px:0',
            width: '200px',
            height: '25px',
            draggable: true,
            dragHandler: '.my-min-view'
        },
        restore: {
            position: 'SE:10px:0',
            draggable: true,
            dragHandler: '.bootstrap-dialog-header'
        },
        onMinimize: function () {
            return '<div class="my-min-view" style="background-color:#00d4b4">车辆信息列表11</div>';
        }
    });
});