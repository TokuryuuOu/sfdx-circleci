/**
 * Online Profile
 * vCardダウンローダ
 * Test
 */
@IsTest
private with sharing class VCardDownloaderTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createOutboundProfileList(200);
    }

    @IsTest
    private static void test() {
        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        String filename = 'text.vcf';

        Test.startTest();
        FileDownloader downloader = new VCardDownloader(profList, filename, 'UTF-8');
        Test.stopTest();

        System.assert(downloader.getContentDisposition().contains(filename));
        System.assert(downloader.getContentType().contains(filename));
        System.assert(downloader.getBody().contains(profList.get(0).Email__c));
    }
}