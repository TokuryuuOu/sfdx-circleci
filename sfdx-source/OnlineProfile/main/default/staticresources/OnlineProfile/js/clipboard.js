/**
 * クリップボード
 */
(function (global) {
    'use strict';

    var Clipboard = function () {
    };
    Clipboard.prototype = {
        /**
         * クリップボードにコピー
         *
         * @param value コピーする値
         * @param buttonElem ボタン要素
         * @param msg ボタンに表示する値
         * @param msec 値を表示する時間(ミリ秒)
         */
        copy: function (value, buttonElem, msg, msec) {
            if (!document.queryCommandSupported("copy")) return;

            var elem = document.createElement("input");
            elem.setAttribute("value", value);
            document.body.appendChild(elem);
            elem.select();
            document.execCommand("copy");
            document.body.removeChild(elem);

            if (!buttonElem || !msg || !msec) return;
            var orgMsg = buttonElem.value;
            buttonElem.value = msg;
            setTimeout(function() {
                buttonElem.value = orgMsg;
            }, msec);
        }
    };

    global.onlineProfile = global.onlineProfile || {};
    global.onlineProfile.clipboard = new Clipboard();
})(window);
