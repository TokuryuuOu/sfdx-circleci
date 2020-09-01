/**
 * CSVレコード
 * Test
 */
@IsTest
private with sharing class CsvRecordTest {
    @TestSetup
    private static void setup() {
        Account acc = TestDataFactory.createAccount();
        TestDataFactory.createContact(acc.Id);
    }

    @IsTest
    private static void test() {
        Contact con = TestDataFactory.getContact();

        Test.startTest();

        CsvRecord record = new CsvRecord();
        record.addValue(con.Account.Name);
        record.addValue(con.MailingPostalCode);
        record.addValue(con.MailingState);
        record.addValue(con.MailingCity);
        record.addValue(con.MailingStreet);
        record.addValue(con.LastName);
        record.addValue(con.FirstName);
        record.addValue(con.Department);
        record.addValue(con.Title);
        record.addValue(con.Email);
        record.addValue(con.MobilePhone);

        Test.stopTest();

        System.assert(record.toString().contains(con.Email));
    }
}