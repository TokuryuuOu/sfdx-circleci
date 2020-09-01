/**
 * Online Profile
 * CSVダウンローダ
 * Test
 */
@IsTest
private with sharing class CsvDownloaderTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createOutboundProfileList(200);
    }

    @IsTest
    private static void testAC() {
        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        String filename = 'text.csv';

        Test.startTest();
        FileDownloader downloader = new CsvDownloader(profList, filename, 'Windows-31J','AC');
        Test.stopTest();

        System.assert(downloader.getContentDisposition().contains(filename));
        System.assert(downloader.getContentType().contains(filename));
        System.assert(downloader.getBody().contains(profList.get(0).Email__c));
    }

    @IsTest
    private static void testOP() {
        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        String filename = 'text.csv';

        Test.startTest();
        FileDownloader downloader = new CsvDownloader(profList, filename, 'Windows-31J','OP');
        Test.stopTest();

        System.assert(downloader.getContentDisposition().contains(filename));
        System.assert(downloader.getContentType().contains(filename));
        System.assert(downloader.getBody().contains(profList.get(0).Email__c));
    }

    @IsTest
    private static void testSV() {
        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        String filename = 'text.csv';

        Test.startTest();
        FileDownloader downloader = new CsvDownloader(profList, filename, 'Windows-31J','SV');
        Test.stopTest();

        System.assert(downloader.getContentDisposition().contains(filename));
        System.assert(downloader.getContentType().contains(filename));
        System.assert(downloader.getBody().contains(profList.get(0).Email__c));
    }
}