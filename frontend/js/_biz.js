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
        //var ladda = $(this).data('ladda') || Ladda.create(this);
        //ladda.start();
        //$(this).data('ladda', ladda);
        //setTimeout(function(){
        //    ladda.stop();
        //}, 300000);
        return false;
    });
    $('#btn_loading').click(function () {
        var ladda = $(this).data('ladda') || Ladda.create(this);
        ladda.start();
        $(this).data('ladda', ladda);
        setTimeout(function () {
            ladda.stop();
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
});

$(function () {

});