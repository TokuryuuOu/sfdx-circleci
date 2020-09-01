/**
 * Online Profile
 * プロフィール交換コントローラ
 * Test
 */
@IsTest
private with sharing class ProfileExchangerControllerTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createOutboundProfile();
    }

    @IsTest
    private static void saveInboundProfile() {
        OutboundProfile__c prof = TestDataFactory.getOutboundProfile();

        PageReference pageRef = Page.ProfileExchanger;
        Test.setCurrentPage(pageRef);
        ApexPages.currentPage().getParameters().put(CryptUtil.createEncryptedRecordId(prof.Id), null);

        Test.startTest();

        ProfileExchangerController controller = new ProfileExchangerController();
        controller.init();
        controller.viewPage();
        controller.inputPage();
        controller.messagePage();
        controller.outProfileId = prof.Id;
        controller.downloadVCard();
        controller.downloadCsv();
        controller.inProfile.LastName__c = '名刺';
        controller.inProfile.FirstName__c = '太郎';
        String email = 'meishi@example.com';
        controller.inProfile.Email__c = email;
        controller.saveInboundProfile();

        Test.stopTest();

        InboundProfile__c inProf = TestDataFactory.getInboundProfile();
        System.assertEquals(email, inProf.Email__c);
    }

    @IsTest
    private static void idWithNull() {
        PageReference pageRef = Page.ProfileExchanger;
        Test.setCurrentPage(pageRef);

        Test.startTest();

        ProfileExchangerController controller = new ProfileExchangerController();
        controller.init();

        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }

    @IsTest
    private static void idWithNotExist() {
        PageReference pageRef = Page.ProfileExchanger;
        ApexPages.currentPage().getParameters().put('xx_xxxxx', null);
        Test.setCurrentPage(pageRef);

        Test.startTest();

        ProfileExchangerController controller = new ProfileExchangerController();
        controller.init();

        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }

    @IsTest
    private static void idWithExpired() {
        OutboundProfile__c prof = TestDataFactory.getOutboundProfile();
        prof.ViewExpirationDate__c = Datetime.now().addDays(-1);
        update prof;

        PageReference pageRef = Page.ProfileExchanger;
        Test.setCurrentPage(pageRef);
        ApexPages.currentPage().getParameters().put(CryptUtil.createEncryptedRecordId(prof.Id), null);

        Test.startTest();

        ProfileExchangerController controller = new ProfileExchangerController();
        controller.init();

        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }
}