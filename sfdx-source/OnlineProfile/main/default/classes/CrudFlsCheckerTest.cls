/**
 * CRUD and FLSチェッカー
 * Test
 */
@IsTest
private with sharing class CrudFlsCheckerTest {
    @IsTest
    private static void checkCreate() {
        Account acc = TestDataFactory.newAccount();

        try {
            Test.startTest();
            SObject sobj = CrudFlsChecker.checkCreate(acc);
            List<SObject> sobjList = CrudFlsChecker.checkCreate(new List<Account> { acc });
            Test.stopTest();

            System.assert(sobj instanceof Account);
            System.assert(sobjList.get(0) instanceof Account);
        } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
            System.assert(false);
        }
    }

/*
    @IsTest
    private static void noAccessByCreate() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        System.runAs(guestUser) {
            try {
                Test.startTest();
                SObject sobj = CrudFlsChecker.checkCreate(acc);
                Test.stopTest();

                System.assert(false);
            } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
                System.assert(true);
            }
        }
    }
*/
    @IsTest
    private static void checkRead() {
        Account acc = TestDataFactory.newAccount();

        try {
            Test.startTest();
            SObject sobj = CrudFlsChecker.checkRead(acc);
            List<SObject> sobjList = CrudFlsChecker.checkRead(new List<Account> { acc });
            Test.stopTest();

            System.assert(sobj instanceof Account);
            System.assert(sobjList.get(0) instanceof Account);
        } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
            System.assert(false);
        }
    }

/*
    @IsTest
    private static void noAccessByRead() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        System.runAs(guestUser) {
            try {
                Test.startTest();
                SObject sobj = CrudFlsChecker.checkRead(acc);
                Test.stopTest();

                System.assert(false);
            } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
                System.assert(true);
            }
        }
    }
*/

    @IsTest
    private static void checkUpdate() {
        Account acc = TestDataFactory.newAccount();

        try {
            Test.startTest();
            SObject sobj = CrudFlsChecker.checkUpdate(acc);
            List<SObject> sobjList = CrudFlsChecker.checkUpdate(new List<Account> { acc });
            Test.stopTest();

            System.assert(sobj instanceof Account);
            System.assert(sobjList.get(0) instanceof Account);
        } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
            System.assert(false);
        }
    }

/*
    @IsTest
    private static void noAccessByUpdate() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        System.runAs(guestUser) {
            try {
                Test.startTest();
                SObject sobj = CrudFlsChecker.checkUpdate(acc);
                Test.stopTest();

                System.assert(false);
            } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
                System.assert(true);
            }
        }
    }
*/

/*    
    @IsTest
    private static void checkUpsert() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        try {
            Test.startTest();
            SObject sobj = CrudFlsChecker.checkUpsert(acc);
            List<SObject> sobjList = CrudFlsChecker.checkUpsert(new List<Account> { acc });
            Test.stopTest();

            System.assert(sobj instanceof Account);
            System.assert(sobjList.get(0) instanceof Account);
        } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
            System.assert(false);
        }
    }
*/

/*
    @IsTest
    private static void noAccessByUpsert() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        System.runAs(guestUser) {
            try {
                Test.startTest();
                SObject sobj = CrudFlsChecker.checkUpsert(acc);
                Test.stopTest();

                System.assert(false);
            } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
                System.assert(true);
            }
        }
    }
*/

    @IsTest
    private static void checkDelete() {
        Account acc = TestDataFactory.newAccount();

        try {
            Test.startTest();
            SObject sobj = CrudFlsChecker.checkDelete(acc);
            List<SObject> sobjList = CrudFlsChecker.checkDelete(new List<Account> { acc });
            Test.stopTest();

            System.assert(sobj instanceof Account);
            System.assert(sobjList.get(0) instanceof Account);
        } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
            System.assert(false);
        }
    }

/*
    @IsTest
    private static void noAccessByDelete() {
        User guestUser = TestDataFactory.getGuestUser();
        Account acc = TestDataFactory.newAccount();

        System.runAs(guestUser) {
            try {
                Test.startTest();
                SObject sobj = CrudFlsChecker.checkDelete(acc);
                Test.stopTest();

                System.assert(false);
            } catch (CrudFlsChecker.CrudFlsCheckerException ex) {
                System.assert(true);
            }
        }
    }
*/
}