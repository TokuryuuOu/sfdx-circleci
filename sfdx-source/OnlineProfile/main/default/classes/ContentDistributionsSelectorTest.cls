/**
 * Online Profile
 * コンテンツ配信Selector
 * Test
 */
@IsTest
private with sharing class ContentDistributionsSelectorTest {
    @TestSetup
    private static void setup() {
        ContentVersion cv = TestDataFactory.createContentVersion();
        TestDataFactory.createContentDistribution(cv);
    }

    @IsTest
    private static void selectById() {
        ContentDistribution cd = TestDataFactory.getContentDistribution();

        Test.startTest();

        ContentDistributionsSelector selector = new ContentDistributionsSelector();
        ContentDistribution resultCd = selector.selectById(cd.Id);

        Test.stopTest();

        System.assertNotEquals(null, resultCd);
    }
}