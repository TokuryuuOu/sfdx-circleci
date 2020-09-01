/**
 * Online Profile
 * ホーム画面コントローラテスト
 */
@IsTest
public with sharing class OnlineProfileHomePageControllerTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createMyProfileList(5);
    }

    @IsTest
    private static void test1() {
        Test.startTest();
        OnlineProfileHomePageController ctlr = new OnlineProfileHomePageController();
        Test.stopTest();

        System.assertEquals(5, ctlr.myProfiles.size());
    }

    @IsTest
    private static void test2() {
        Test.startTest();
        OnlineProfileHomePageController ctlr = new OnlineProfileHomePageController();
        ctlr.convertUserInfo();
        Test.stopTest();

        System.assertEquals(6, ctlr.myProfiles.size());
    }
}