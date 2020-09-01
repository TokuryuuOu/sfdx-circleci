/**
 * Button
 *
 * require
 *   <script src='/canvas/sdk/js/publisher.js'></script>
 */
(function (global) {
    'use strict';

    var Button = function () {
    };
    Button.prototype = {
        close: function () {
            if ((typeof sforce != 'undefined') && sforce && (!!sforce.one)) {
                Sfdc.canvas.publisher.publish({name:'publisher.close', payload:{refresh:'true'}});
            }
            window.close();
        }
    };

    global.onlineProfile = global.onlineProfile || {};
    global.onlineProfile.button = new Button();
})(window);
