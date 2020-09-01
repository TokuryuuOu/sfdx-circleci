/**
 * Online Profile
 * 画像登録コントローラ
 * Test
 */
@IsTest
private with sharing class ImageRegisterControllerTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createMyProfile();
    }

    @IsTest
    private static void save() {
        MyProfile__c prof = TestDataFactory.getMyProfile();

        PageReference pageRef = Page.ImageRegister;
        Test.setCurrentPage(pageRef);
        ApexPages.StandardController standardController = new ApexPages.StandardController(prof);

        Test.startTest();

        ImageRegisterController controller = new ImageRegisterController(standardController);
        controller.contentVersion.VersionData = Blob.valueOf('test');
        controller.contentVersion.PathOnClient = 'test.png';
        controller.save();

        Test.stopTest();

        prof = TestDataFactory.getMyProfile();
        System.assertNotEquals(null, prof.ImageUrl__c);
    }

    @IsTest
    private static void deleteImage() {
        MyProfile__c prof = TestDataFactory.getMyProfile();

        PageReference pageRef = Page.ImageRegister;
        Test.setCurrentPage(pageRef);
        ApexPages.StandardController standardController = new ApexPages.StandardController(prof);

        

        ImageRegisterController controller = new ImageRegisterController(standardController);
        controller.contentVersion.VersionData = Blob.valueOf('test');
        controller.contentVersion.PathOnClient = 'test.png';
        controller.save();

        Test.startTest();
        controller.deleteImage();
        Test.stopTest();

        prof = TestDataFactory.getMyProfile();
        System.assertEquals(null, prof.ImageUrl__c);
    }

    @IsTest
    private static void versionDataWithNull() {
        MyProfile__c prof = TestDataFactory.getMyProfile();

        PageReference pageRef = Page.ImageRegister;
        Test.setCurrentPage(pageRef);
        ApexPages.StandardController standardController = new ApexPages.StandardController(prof);

        Test.startTest();

        ImageRegisterController controller = new ImageRegisterController(standardController);
        controller.contentVersion.VersionData = null;
        controller.contentVersion.PathOnClient = null;
        controller.save();

        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }

    @IsTest
    private static void throwException() {
        MyProfile__c prof = TestDataFactory.getMyProfile();

        PageReference pageRef = Page.ImageRegister;
        Test.setCurrentPage(pageRef);
        ApexPages.StandardController standardController = new ApexPages.StandardController(prof);

        Test.startTest();

        ImageRegisterController controller = new ImageRegisterController(standardController);
        controller.contentVersion.VersionData = Blob.valueOf('test');
        controller.contentVersion.PathOnClient = 'test.png';
        controller.myProfile.Id = null;
        controller.save();

        Test.stopTest();

        System.assert(ApexPages.hasMessages(ApexPages.severity.ERROR));
    }
}