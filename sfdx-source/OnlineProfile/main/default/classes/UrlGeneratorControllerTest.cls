/**
 * Online Profile
 * URL生成コントローラ
 * Test
 */
@IsTest
private with sharing class UrlGeneratorControllerTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createConfig();
        TestDataFactory.createMyProfile();
    }

    @IsTest
    private static void test() {
        MyProfile__c myProf = TestDataFactory.getMyProfile();

        PageReference pageRef = Page.UrlGenerator;
        Test.setCurrentPage(pageRef);
        ApexPages.currentPage().getParameters().put('id', myProf.Id);

        Test.startTest();

        UrlGeneratorController controller = new UrlGeneratorController();
        controller.addMemberPage();
        controller.searchString = 'example.com';
        controller.searchProf();
        controller.nextSearchProf();
        controller.prevSearchProf();

        for (MyProfile__c prof : TestDataFactory.createMyProfileList(10)) {
            UrlGeneratorController.MyProfile searchProf = new UrlGeneratorController.MyProfile(prof);
            searchProf.checked = true;
            controller.searchProfList.add(searchProf);
        }
        controller.addProf();
        pageRef.getParameters().put('vf_rownumber','0');
        controller.deleteProf();
        controller.generateUrlPage();
        controller.generateUrl();

        Test.stopTest();

        System.assertNotEquals(null, controller.exchangeProfUrl);
    }
}