/**
 * Online Profile
 * 送信プロフィールSelector
 * Test
 */
@IsTest
private with sharing class OutboundProfilesSelectorTest {
    @TestSetup
    private static void setup() {
        List<OutboundProfile__c> profList = TestDataFactory.createOutboundProfileList(200);
    }

    @IsTest
    private static void selectById() {
        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        Id parentId = profList.get(0).Id;
        for (Integer i = 1; i < profList.size(); i++) {
            profList.get(i).Parent__c = parentId;
        }
        update profList;

        Test.startTest();

        OutboundProfilesSelector selector = new OutboundProfilesSelector();
        List<OutboundProfile__c> resultProf = selector.selectByParentId(parentId);

        Test.stopTest();

        System.assertEquals(Integer.valueOf(selector.getLimit()), resultProf.size());
    }

    @IsTest
    private static void selectByMyProfileId() {
        List<MyProfile__c> myProfList = TestDataFactory.newMyProfileList(1);
        insert myProfList;

        List<OutboundProfile__c> profList = TestDataFactory.getOutboundProfileList(200);
        Id parentId = profList.get(0).Id;
        for (Integer i = 1; i < profList.size(); i++) {
            profList.get(i).MyProfile__c = myProfList[0].Id;
        }
        update profList;

        Test.startTest();

        OutboundProfilesSelector selector = new OutboundProfilesSelector();
        List<OutboundProfile__c> resultProf = selector.selectByMyProfileId(myProfList[0].Id);

        Test.stopTest();

        System.assertEquals(Integer.valueOf(selector.getLimit()), resultProf.size());
    }
}