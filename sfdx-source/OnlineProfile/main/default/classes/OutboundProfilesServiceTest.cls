/**
 * Online Profile
 * 送信プロフィールService
 * Test
 */
@IsTest
private with sharing class OutboundProfilesServiceTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createConfig();
        TestDataFactory.createMyProfileList(10);
    }

    @IsTest
    private static void create() {
        List<MyProfile__c> profList = TestDataFactory.getMyProfileList(10);
        MyProfile__c prof = profList.get(0);
        List<MyProfile__c> memberList = new List<MyProfile__c>();
        Integer viewCountLimit = 300;
        Datetime viewExpirationDate = Datetime.now().addDays(14);
        for (Integer i = 1; i < profList.size(); i++) {
            memberList.add(profList.get(i));
        }

        Test.startTest();
        OutboundProfilesService.create(prof, memberList, viewCountLimit, viewExpirationDate,'password', true);
        Test.stopTest();

        System.assertEquals(10, TestDataFactory.getOutboundProfileList(200).size());
    }

    @IsTest
    private static void throwException() {
        try {
            Test.startTest();
            OutboundProfilesService.create(null, null,null, null ,null, null);
            Test.stopTest();
            System.assert(false);
        } catch (OutboundProfilesService.OutboundProfilesServiceException ex) {
            System.assert(true);
        }
    }
}