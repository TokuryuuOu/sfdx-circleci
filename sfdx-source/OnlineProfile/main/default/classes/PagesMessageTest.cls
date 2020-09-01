/**
 * Visualforceメッセージ出力
 * Test
 */
@IsTest
private with sharing class PagesMessageTest {
    @IsTest
    private static void info() {
        String msg = 'test';

        Test.startTest();
        PagesMessage.info(msg);
        Test.stopTest();

        System.assert(ApexPages.getMessages().toString().contains(msg));
    }

    @IsTest
    private static void warn() {
        String msg = 'test';

        Test.startTest();
        try {
            throw new PagesMessageTestException(msg);
        } catch (PagesMessageTestException ex) {
            PagesMessage.warn(ex);
        }
        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }

    @IsTest
    private static void error() {
        String msg = 'test';

        Test.startTest();
        try {
            throw new PagesMessageTestException(msg);
        } catch (PagesMessageTestException ex) {
            PagesMessage.error(ex);
        }
        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }

    private class PagesMessageTestException extends Exception {}
}