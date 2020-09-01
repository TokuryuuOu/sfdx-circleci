/**
 * Online Profile
 * マイプロフィールService
 * Test
 */
@IsTest
private with sharing class MyProfilesServiceTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createMyProfileList(200);
    }

/*
    @IsTest
    private static void setDefault() {
        List<MyProfile__c> profList = TestDataFactory.getMyProfileList(200);
        for (MyProfile__c prof : profList) {
            prof.IsDefault__c = true;
        }

        Test.startTest();
        MyProfilesService.setDefault(profList);
        Test.stopTest();

        Integer count = 0;
        for (MyProfile__c prof : TestDataFactory.getMyProfileList(200)) {
            if (!prof.IsDefault__c) continue;
            count++;
        }
        System.assertEquals(1, count);
    }
*/
}