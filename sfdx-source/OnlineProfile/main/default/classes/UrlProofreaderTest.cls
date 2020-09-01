/**
 * URL校正
 * Test
 */
@IsTest
private with sharing class UrlProofreaderTest {
    private static final String CORRECT_URL = 'https://xxxx-dev-ed--c.documentforce.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Jpg&versionId=068000000000000&d=/a/000000000000/_AAAAAAAAAAAAAAAA.BBBBBBBBBBBBBBBBB.CCCCCCC&oid=00D000000000000';
    private static final String INCORRECT_URL = 'https://xxxx-dev-ed--c--c.documentforce.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Jpg&versionId=068000000000000&d=/a/000000000000/_AAAAAAAAAAAAAAAA.BBBBBBBBBBBBBBBBB.CCCCCCC&oid=00D000000000000';

    @IsTest
    private static void correctUrl() {
        Test.startTest();
        String fixedUrl = UrlProofreader.fix(CORRECT_URL);
        Test.stopTest();

        System.assertEquals(CORRECT_URL, fixedUrl);
    }

    @IsTest
    private static void incorrectUrl() {
        Test.startTest();
        String fixedUrl = UrlProofreader.fix(INCORRECT_URL);
        Test.stopTest();

        System.assertEquals(CORRECT_URL, fixedUrl);
    }

    @IsTest
    private static void brankUrl() {
        Test.startTest();
        String fixedUrl = UrlProofreader.fix('');
        Test.stopTest();

        System.assertEquals(null, fixedUrl);
    }
}