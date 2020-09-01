/**
 * ダウンローダ
 * Test
 */
@IsTest
private with sharing class FileDownloaderTest {
    @IsTest
    private static void test() {
        String filename = 'test.txt';
        String body = 'test';

        Test.startTest();
        FileDownloader downloader = new TestDownloader(filename, body);
        Test.stopTest();

        System.assert(downloader.getContentDisposition().contains(filename));
        System.assert(downloader.getContentType().contains(filename));
        System.assert(downloader.getBody().contains(body));
    }

    private with sharing class TestDownloader extends FileDownloader {
        private String body;

        public TestDownloader(String filename, String body) {
            this.filename = filename;
            this.body = body;
        }

        public override String getContentType() {
            return 'text/plain;#' + filename;
        }

        public override String getBody() {
            return body;
        }
    }
}