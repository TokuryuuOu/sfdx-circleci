/**
 * Online Profile
 * コンテンツバージョンSelector
 * Test
 */
@IsTest
private with sharing class ContentVersionsSelectorTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createContentVersion();
    }

    @IsTest
    private static void selectById() {
        ContentVersion cv = TestDataFactory.getContentVersion();

        Test.startTest();

        ContentVersionsSelector selector = new ContentVersionsSelector();
        ContentVersion resultCv = selector.selectById(cv.Id);

        Test.stopTest();

        System.assertNotEquals(null, resultCv);
    }
}