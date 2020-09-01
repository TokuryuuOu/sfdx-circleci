/**
 * Visualforceメッセージ出力
 */
public with sharing class PagesMessage {
    public static void info(String msg) {
        ApexPages.addMessage(new ApexPages.Message(ApexPages.severity.INFO, msg));
    }

    public static void warn(Exception ex) {
        ApexPages.addMessages(ex);
    }

    public static void error(Exception ex) {
        System.debug(LoggingLevel.ERROR, ex.getMessage() + '\n' + ex.getStackTraceString());
        ApexPages.addMessage(new ApexPages.Message(ApexPages.severity.ERROR, 'エラーが発生しました。'));
    }
}