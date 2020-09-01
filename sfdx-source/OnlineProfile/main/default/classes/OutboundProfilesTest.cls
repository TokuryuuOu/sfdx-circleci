/**
 * Online Profile
 * 送信プロフィール
 * Test
 */
@IsTest
private with sharing class OutboundProfilesTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createConfig();
        TestDataFactory.createMyProfileList(10);
    }

    @IsTest
    private static void test() {
        List<MyProfile__c> profList = TestDataFactory.getMyProfileList(10);
        List<MyProfile__c> memberList = new List<MyProfile__c>();
        Integer viewCountLimit = 300;
        Datetime viewExpirationDate = Datetime.now().addDays(14);
        MyProfile__c prof = profList.get(0);
        for (Integer i = 1; i < profList.size(); i++) {
            memberList.add(profList.get(i));
        }

        Test.startTest();

        OutboundProfiles outProfs = new OutboundProfiles(prof,viewCountLimit,viewExpirationDate,'password',true);
        outProfs.setMemberProfiles(memberList,viewCountLimit,viewExpirationDate,'password',true);
        //outProfs.generateExchangeProfileUrl();

        Test.stopTest();

        System.assertEquals(prof.Id, outProfs.getProfile().MyProfile__c);
        System.assertEquals(memberList.size(), outProfs.getMemberProfiles().size());
        //System.assertNotEquals(null, outProfs.getExchangeProfileUrl());
    }
}