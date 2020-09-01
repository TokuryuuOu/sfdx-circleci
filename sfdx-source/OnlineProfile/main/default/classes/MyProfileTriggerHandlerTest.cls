/**
 * Online Profile
 * マイプロフィールトリガハンドラ
 * Test
 */
@IsTest
private with sharing class MyProfileTriggerHandlerTest {
    @IsTest
    private static void test() {
        Test.startTest();

        List<MyProfile__c> profList = TestDataFactory.createMyProfileList(200);
        for (MyProfile__c prof : profList) {
            prof.IsDefault__c = true;
        }
        update profList;

        Test.stopTest();

        System.assertEquals(200, TestDataFactory.getMyProfileList(200).size());
    }
}