/**
 * Online Profile
 * マイプロフィールService
 */
public with sharing class MyProfilesService {
    public static List<Database.SaveResult> setDefault(List<MyProfile__c> profList) {
        try {
            Map<Id, Id> ignoreIdMap = new Map<Id, Id>();
            for (MyProfile__c prof : profList) {
                if (!prof.IsDefault__c) continue;
                ignoreIdMap.put(prof.OwnerId, prof.Id);
            }
            Set<Id> ownerIdSet = ignoreIdMap.keySet();
            Set<Id> ignoreIdSet = new Set<Id>(ignoreIdMap.values());
    
            MyProfilesSelector selector = new MyProfilesSelector();
            selector.setLimit(200);
    
            List<MyProfile__c> defaultProfList = selector.selectDefaultByOwnerId(ownerIdSet, ignoreIdSet);
            List<MyProfile__c> updProfList = new List<MyProfile__c>();
    
            for (MyProfile__c prof : defaultProfList) {
                updProfList.add(new MyProfile__c(Id=prof.Id, IsDefault__c=false));
            }
            return Database.update(CrudFlsChecker.checkUpdate(updProfList), true);
        } catch( Exception e ){
            // PRODUCT-138 「他人のプロフィールをコピーして所有者変更したところ、アクセス権エラーとトリガエラーが発生した」対応
            /* 他人所有の名刺の更新権限を持たないユーザが、
               IsDefault__c = true のレコードを保有しているユーザに対して、
               IsDefault__c = true のレコードの所有権を移転したタイミングでエラーが発生します。

               呼び出し元の処理で戻り値 List<Database.SaveResult>の値を特段確認していないことから、
               今回のリリースではnullを返却してINSUFFICIENT_ACCESS_OR_READONLYで所有者変更処理が止まらないよう修正します。
             */
            return null;
        }
        
    }

    public static MyProfile__c createByUserId(Id userId){
        if (userId == null) {
            throw new MyProfilesServiceException('ユーザIDを指定してください。');
        }
        Savepoint sp = Database.setSavepoint();
        try {
            MyProfile__c myProf = new MyProfile__c();
            User user = [Select LastName, FirstName, Email, MobilePhone, Department, Title, Phone From User Where Id =: userId];
            myProf.LastName__c = user.LastName;
            myProf.FirstName__c = String.isBlank(user.FirstName) ? '(未設定)' : user.FirstName;
            myProf.Name = user.LastName + ( String.isBlank(user.FirstName) ? ' (未設定)' : ' ' + user.FirstName);
            myProf.Email__c = user.Email;
            myProf.MobilePhone__c = user.MobilePhone;
            myProf.Department__c = user.Department;
            myProf.Title__c = user.Title;
            myProf.Tel1__c = user.Phone;

            Organization org = [Select Name, PostalCode, State, City, Street, Phone FROM Organization limit 1];
            myProf.CompanyName__c = org.Name;
            myProf.PostalCode__c = org.PostalCode;
            myProf.State__c = org.State;
            myProf.City__c = org.City;
            myProf.Street__c = org.Street;
            myProf.Tel__c = org.Phone;
            Database.insert(CrudFlsChecker.checkCreate(new List<SObject> { myProf }), true);
            return myProf;
        } catch (Exception ex) {
            Database.rollback(sp);
            throw ex;
        }
    }

    public class MyProfilesServiceException extends Exception {}
}