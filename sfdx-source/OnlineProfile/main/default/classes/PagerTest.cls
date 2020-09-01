/**
 * Pager
 * Test
 */
@IsTest
private with sharing class PagerTest {
    @TestSetup
    private static void setup() {
        Account acc = TestDataFactory.createAccount();
        TestDataFactory.createContact(acc.Id);
    }

    @IsTest
    private static void test() {
        Contact con = TestDataFactory.getContact();
        Integer searchLimit = 200;

        Test.startTest();

        Pager pager = new Pager(searchLimit);
        pager.reset();
        pager.next();
        pager.prev();
        pager.setRenderLink('test', searchLimit+1);

        Test.stopTest();

        System.assert(pager.renderNextLink);
    }
}