/**
 * Online Profile
 * 送信プロフィールService
 */
public with sharing class OutboundProfilesService {
    public static OutboundProfiles create(MyProfile__c myProf, List<MyProfile__c> memberProfs, Decimal viewCountLimit, Datetime viewExpirationDate, String password, Boolean isSendNotify) {
        if (myProf == null) {
            throw new OutboundProfilesServiceException('マイプロフィールを指定してください。');
        }

        Savepoint sp = Database.setSavepoint();
        try {
            OutboundProfiles outProfs = new OutboundProfiles(myProf,viewCountLimit,viewExpirationDate,password,isSendNotify);
            Database.insert(CrudFlsChecker.checkCreate(outProfs.getProfile()), true);

            outProfs.setMemberProfiles(memberProfs,viewCountLimit,viewExpirationDate,password,isSendNotify);
            outProfs.generateExchangeProfileUrl();
            Database.update(CrudFlsChecker.checkUpdate(outProfs.getProfile()), true);
            Database.insert(CrudFlsChecker.checkCreate(outProfs.getMemberProfiles()), true);

            return outProfs;
        } catch (Exception ex) {
            Database.rollback(sp);
            throw ex;
        }
    }

    public class OutboundProfilesServiceException extends Exception {}
}