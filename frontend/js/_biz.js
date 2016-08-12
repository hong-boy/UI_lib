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

    // - 单选、复选
    $('#chk_radio_wrap input:radio').iCheck({
        radioClass: 'iradio_normal',
        labelHover: false
    });
    $('#chk_radio_wrap input:checkbox').iCheck({
        checkboxClass: 'icheckbox_normal',
        labelHover: false
    });
});

$(function () {

});