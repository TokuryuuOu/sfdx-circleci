/**
 * VCard
 * Test
 */
@IsTest
private with sharing class VCardTest {
    @TestSetup
    private static void setup() {
        Account acc = TestDataFactory.createAccount();
        TestDataFactory.createContact(acc.Id);
    }

    @IsTest
    private static void test() {
        Contact con = TestDataFactory.getContact();

        Test.startTest();

        VCard vc = new VCard();
        vc.setN(con.LastName, con.FirstName);
        vc.setOrg(con.Account.Name);
        vc.setEmail(con.Email);
        vc.setTel(con.Phone);
        vc.setCell(con.MobilePhone);
        vc.setAdr(null, con.MailingPostalCode, con.MailingState, con.MailingCity, con.MailingStreet);
        vc.setUrl(con.Account.Website);

        Test.stopTest();

        System.assert(vc.toString().contains(con.Email));
    }
}