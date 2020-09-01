/**
 * Online Profile
 * マイプロフィールSelector
 * Test
 */
@IsTest
private with sharing class MyProfilesSelectorTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createMyProfileList(200);
    }

    @IsTest
    private static void selectById() {
        MyProfile__c prof = TestDataFactory.getMyProfile();

        Test.startTest();

        MyProfilesSelector selector = new MyProfilesSelector();
        MyProfile__c resultProf = selector.selectById(prof.Id);
        List<MyProfile__c> resultProfList = selector.selectById(new Set<Id> { prof.Id });

        Test.stopTest();

        System.assertNotEquals(null, resultProf);
        System.assert(!resultProfList.isEmpty());
    }

    @IsTest
    private static void selectDefaultByOwnerId() {
        MyProfile__c prof = TestDataFactory.getMyProfile();
        List<MyProfile__c> profList = TestDataFactory.getMyProfileList(200);
        Set<Id> ownerIdSet = new Set<Id>();
        for (MyProfile__c  profile :  profList) {
            ownerIdSet.add(profile.OwnerId);
        }

        Test.startTest();

        MyProfilesSelector selector = new MyProfilesSelector();
        MyProfile__c resultProf = selector.selectDefaultByOwnerId(prof.OwnerId);
        List<MyProfile__c> resultProfList = selector.selectDefaultByOwnerId(ownerIdSet, new Set<Id>());

        Test.stopTest();

        System.assertNotEquals(null, resultProf);
        System.assertEquals(1, resultProfList.size());
    }

    @IsTest
    private static void selectBySearchString() {
        List<MyProfile__c> profList = TestDataFactory.getMyProfileList(200);
        String searchString = null;
        for (MyProfile__c prof : profList) {
            if (!prof.IsDefault__c) continue;
            searchString = prof.Email__c;
            break;
        }

        Test.startTest();

        MyProfilesSelector selector = new MyProfilesSelector();
        List<MyProfile__c> resultProfList = selector.selectBySearchString(searchString,true, new Set<Id>());

        Test.stopTest();

        System.debug(searchString);
        System.debug(profList);
        System.debug(resultProfList);
        System.assertNotEquals(0, resultProfList.size());
    }
}