/**
 * Online Profile
 * プロフィール交換
 * Test
 */
@IsTest
private with sharing class ProfileExchangerTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createOutboundProfileList(200);
    }

    @IsTest
    private static void test() {
        List<OutboundProfile__c> outProfList = TestDataFactory.getOutboundProfileList(200);

        Test.startTest();

        ProfileExchanger profExchanger = new ProfileExchanger(outProfList);
        System.assertEquals(true, profExchanger.hasOutboundProfile());
        System.assertEquals(false, profExchanger.isExpired());
        System.assert(String.isNotBlank(profExchanger.getCompanyName()));
        System.assert(String.isNotBlank(profExchanger.getOutboundProfile().Email__c));
        System.assert(!profExchanger.getOutboundProfileList().isEmpty());
        System.assert(!profExchanger.getOutProfileMaps().isEmpty());
        System.assert(String.isNotBlank(profExchanger.getTextProfiles()));
        System.assert(profExchanger.getInboundProfile() != null);

        Test.stopTest();
    }
}