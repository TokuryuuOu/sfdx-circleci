/**
 * Online Profile
 * プロフィール交換
 */
(function (global) {
    'use strict';

    var ProfileExchanger = function () {
    };
    ProfileExchanger.prototype = {
        /** コピー, 全てコピー */
        copyClipboard: function(componentId) {
            var textarea = document.getElementById(componentId);
            textarea.style.display = "block";
            textarea.select();
            document.execCommand("copy");
            textarea.blur();
            textarea.style.display = "none";
            UIkit.notification({message: "<span uk-icon='icon: copy'></span> コピーしました", status: "success", timeout: "900"});
        },

        /** メッセージアコーディオン */
        onMessage: function(moreImage) {
            jQuery.fn.hasScrollBar = function() {
                return (this.get(0) && this.get(0).scrollHeight) ? this.get(0).scrollHeight - 1 > this.get(0).clientHeight : false;
            }
            $('blockquote > p').each(function (i, e) {
                var more = $('<div class="more uk-align-center"><img class="uk-align-center" src="' + moreImage + '" alt=""></div>');
                $(e).hasScrollBar() && $(e).after(more);
                var f = function () {
                    if ($(e).css('max-height') != '100px') {
                        $(e).css('max-height', '100px');
                        more.show();
                    } else {
                        $(e).css('max-height', 'initial');
                        more.hide();
                    }
                }
                $(e).on('click', f);
                more.on('click', f);
            });
        }
    };

    global.onlineProfile = global.onlineProfile || {};
    global.onlineProfile.profileExchanger = new ProfileExchanger();
})(window);
