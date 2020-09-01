/**
 * Online Profile
 * マイプロフィールトリガ
 */
trigger MyProfile on MyProfile__c (after insert, after update) {
    MyProfileTriggerHandler handler = new MyProfileTriggerHandler();

    if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            handler.onAfterInsert(Trigger.new);
        } else if (Trigger.isUpdate) {
            handler.onAfterUpdate(Trigger.new, Trigger.oldMap);
        }
    }
}