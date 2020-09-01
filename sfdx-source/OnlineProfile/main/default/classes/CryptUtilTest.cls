/**
 * Online Profile
 * CryptUtil
 * Test
 */
@IsTest
private with sharing class CryptUtilTest {

    @IsTest
    private static void createHashedPassword () {
        String password = 'test0001';

        Test.startTest();
        String hashedPassword = CryptUtil.createHashedPassword(password) ;
        Test.stopTest();

        System.assertNotEquals(null, hashedPassword);
    }
    @IsTest
    private static void createEncryptedRecordId () {
		OutboundProfile__c op = new OutboundProfile__c(
        	LastName__c = 'SEI',
        	FirstName__c  = 'MEI',
            Email__c   = 'test@example.com',
            CreatedDate__c = System.today()
        );
        insert op;
        Test.startTest();
        String encrypedId = CryptUtil.createEncryptedRecordId(op.Id) ;
        String recordId = CryptUtil.decryptEncryptedRecordId(encrypedId) ;
        Test.stopTest();

        System.assertNotEquals(null, encrypedId);
        System.assertEquals(op.Id, recordId);
    }
}