/**
 * Online Profile
 * 画像登録Service
 * Test
 */
@IsTest
private with sharing class ImageRegisterServiceTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createMyProfile();
    }

    @IsTest
    private static void test() {
        MyProfile__c prof = TestDataFactory.getMyProfile();
        ContentVersion contentVer = new ContentVersion(
            VersionData = Blob.valueOf('test'),
            PathOnClient = 'test.png'
        );

        Test.startTest();

        ImageRegisterService.Image registImage = new ImageRegisterService.Image(prof, contentVer);
        registImage = ImageRegisterService.upsertImage(registImage);

        Test.stopTest();

        System.assertNotEquals(null, registImage.prof);
    }

    @IsTest
    private static void deleteImage() {
        MyProfile__c prof = TestDataFactory.getMyProfile();
        ContentVersion contentVer = new ContentVersion(
            VersionData = Blob.valueOf('test'),
            PathOnClient = 'test.png'
        );

        ImageRegisterService.Image registImage = new ImageRegisterService.Image(prof, contentVer);
        registImage = ImageRegisterService.upsertImage(registImage);
        Test.startTest();
        registImage = ImageRegisterService.deleteImage(registImage);
        Test.stopTest();

        System.assertNotEquals(null, registImage.prof);
    }
}