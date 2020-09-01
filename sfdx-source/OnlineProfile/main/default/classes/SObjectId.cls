/**
 * オブジェクトID
 */
public with sharing class SObjectId {
    /**
     * オブジェクトIDから短縮IDを取得する
     *
     * @param longId オブジェクトID
     * @return 短縮ID
     */
    public static String getShortId(Id sobjId) {
        if (sobjId == null) return null;

        String shortId = String.valueOf(sobjId).left(15).right(12);

        // 連続する0を_にする
        return shortId.replaceFirst('0+', '_');
    }

    /**
     * 短縮IDからオブジェクトIDを取得する
     *
     * @param shortId 短縮ID
     * @param sobjType SObjectType
     * @return オブジェクトID
     * @throws SObjectIdException 変換失敗
     */
    public static Id getLongId(String shortId, SObjectType sobjType) {
        if (String.isBlank(shortId)) return null;
        if (sobjType == null) throw new SObjectIdException('SObjectType is null');

        String pref = sobjType.getDescribe().getKeyPrefix();

        // _を0で埋めて全体で15文字にする
        String longId = pref
            + shortId.substringBefore('_')
            + ''.rightPad(13-shortId.length(), '0')
            + shortId.substringAfter('_');

        try {
            return Id.valueOf(longId);
        } catch (StringException ex) {
            throw new SObjectIdException('Invalid shortId: ' + shortId + ' -> ' + longId);
        }
    }

    public class SObjectIdException extends Exception {}
}