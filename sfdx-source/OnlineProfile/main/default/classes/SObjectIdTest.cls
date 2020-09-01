/**
 * オブジェクトID
 * Test
 */
@IsTest
private with sharing class SObjectIdTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createAccount();
    }

    @IsTest
    private static void convertId() {
        Account acc = TestDataFactory.getAccount();
        Test.startTest();
        String shortId = SObjectId.getShortId(acc.Id);
        Id accId = SObjectId.getLongId(shortId, Account.sObjectType);
        Test.stopTest();
        System.assertEquals(acc.Id, accId);
    }

    @IsTest
    private static void idWithNull() {
        Test.startTest();
        String shortId = SObjectId.getShortId(null);
        Id accId = SObjectId.getLongId(shortId, Account.sObjectType);
        Test.stopTest();
        System.assertEquals(null, accId);
    }

    @IsTest
    private static void idWithInvalId() {
        try {
            Test.startTest();
            String shortId = 'invalidId';
            Id accId = SObjectId.getLongId(shortId, Account.sObjectType);
            Test.stopTest();
            System.assert(false);
        } catch (Exception ex) {
            System.assert(ex instanceof SObjectId.SObjectIdException);
        }
    }

    @IsTest
    private static void sobjTypeWithNull() {
        Account acc = TestDataFactory.getAccount();
        try {
            Test.startTest();
            String shortId = SObjectId.getShortId(acc.Id);
            Id accId = SObjectId.getLongId(shortId, null);
            Test.stopTest();
            System.assert(false);
        } catch (Exception ex) {
            System.assert(ex instanceof SObjectId.SObjectIdException);
        }
    }
}