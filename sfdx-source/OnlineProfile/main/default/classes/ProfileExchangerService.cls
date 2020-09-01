/**
 * Online Profile
 * プロフィール交換Service
 */
public with sharing class ProfileExchangerService {
    /** 表示回数更新 */
    public static List<Database.SaveResult> updateViewCount(List<OutboundProfile__c> outProfList) {
        List<OutboundProfile__c> updOutProfList = new List<OutboundProfile__c>();
        for (OutboundProfile__c outProf : outProfList) {
            Decimal viewCount = (outProf.ViewCount__c != null) ? outProf.ViewCount__c : 0;
            viewCount++;
            updOutProfList.add(new OutboundProfile__c(Id=outProf.Id, ViewCount__c=viewCount));
        }
        return new SystemMode().updateSObject(updOutProfList);
    }

    /** 受信プロフィール作成 */
    public static List<Database.SaveResult> createInboundProfile(List<InboundProfile__c> profList) {
        for (InboundProfile__c prof : profList) {
            prof.CreatedDate__c = Datetime.now();
        }
        return new SystemMode().createSObject(profList);
    }

    /**
     * システムモードでDML実行
     * ゲストユーザに付与できる共有アクセス権は参照のみ
     */
    private without sharing class SystemMode {
        public List<Database.SaveResult> createSObject(List<SObject> sobjList) {
            return Database.insert(CrudFlsChecker.checkCreate(sobjList), true);
        }

        public List<Database.SaveResult> updateSObject(List<SObject> sobjList) {
            return Database.update(CrudFlsChecker.checkUpdate(sobjList), true);
        }
    }
}