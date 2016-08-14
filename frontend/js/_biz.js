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

    //下拉列表 - 单选
    $('#single_dropdown').selectpicker();
    //下拉列表 - 多选
    $('#multi_drowdown').selectpicker();
    $('#multi1_drowdown').selectpicker();
    $('#multi2_drowdown').selectpicker();
    $('#multi3_drowdown').selectpicker();
});

$(function () {

});