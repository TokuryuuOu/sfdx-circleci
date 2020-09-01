/**
 * URL校正
 *
 * 画像URL(数式)のホスト名に含まれる'--c'が
 * '--c--c'になっている事があるので修正する
 * 原因不明
 */
public with sharing class UrlProofreader {
    private UrlProofreader() {}

    public static String fix(final String url) {
        String fixedUrl = String.isNotBlank(url) ? url.replaceFirst('--c--c', '--c') : null;
        System.debug(url + ' -> ' + fixedUrl);
        return fixedUrl;
    }
}