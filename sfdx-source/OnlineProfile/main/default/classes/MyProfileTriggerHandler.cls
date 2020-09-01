/**
 * Online Profile
 * マイプロフィールトリガハンドラ
 */
public with sharing class MyProfileTriggerHandler {
    public void onAfterInsert(List<MyProfile__c> newMyProfList) {
        MyProfilesService.setDefault(newMyProfList);
    }

    public void onAfterUpdate(List<MyProfile__c> newMyProfList, Map<Id, MyProfile__c> oldMyProfMap) {
        MyProfilesService.setDefault(newMyProfList);
    }
}