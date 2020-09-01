/**
 * Online Profile
 * プロフィール交換Service
 * Test
 */
@IsTest
private with sharing class ProfileExchangerServiceTest {
    @IsTest
    private static void updateViewCount() {
        TestDataFactory.createOutboundProfileList(200);
        List<OutboundProfile__c> outProfList = TestDataFactory.getOutboundProfileList(200);

        Test.startTest();
        ProfileExchangerService.updateViewCount(outProfList);
        Test.stopTest();

        for (OutboundProfile__c outProf : TestDataFactory.getOutboundProfileList(200)) {
            System.assertEquals(1, outProf.ViewCount__c);
        }
    }

    @IsTest
    private static void createInboundProfile() {
        String email = 'meishi@example.com';
        InboundProfile__c inProf = new InboundProfile__c(
            LastName__c = '名刺',
            FirstName__c = '太郎',
            Email__c = email
        );

        Test.startTest();
        ProfileExchangerService.createInboundProfile(new List<InboundProfile__c> { inProf });
        Test.stopTest();

        System.assertEquals(email, TestDataFactory.getInboundProfile().Email__c);
    }
}