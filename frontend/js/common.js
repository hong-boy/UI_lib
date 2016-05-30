'use strict';
var IOT = {
    /**
     * 将字符串中的占位符转换为给定字符
     * @param str 目标字符串 形如：'/users/{0}?password={1}'，其中0\1代表占位符所对应的参数的顺序
     * @returns {*} 返回一个新的字符串
     */
    formatString: function (str) {
        if (!str || !str.length) {
            return str;
        }
        for (var tempStr = str, i = 0, len = arguments.length - 1; i < len; i++) {
            tempStr = tempStr.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i + 1]);
        }
        return tempStr;
    },
    /**
     * 对HTML代码进行转码
     * @param s
     * @returns {string}
     */
    encodeHtml: function (s) {
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
};