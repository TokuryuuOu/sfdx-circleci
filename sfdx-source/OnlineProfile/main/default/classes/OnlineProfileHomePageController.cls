/**
 * Online Profile
 * ホーム画面コントローラ
 */
public with sharing class OnlineProfileHomePageController {
    public List<MyProfile__c> myProfiles { get; private set; }

    public OnlineProfileHomePageController() {
        myProfiles = new MyProfilesSelector().selectByOwnerId(UserInfo.getUserId());
    }

    public Pagereference convertUserInfo(){
        MyProfile__c newProf = MyProfilesService.createByUserId(UserInfo.getUserId());
        myProfiles = new MyProfilesSelector().selectByOwnerId(UserInfo.getUserId());
        return null;
    }
}