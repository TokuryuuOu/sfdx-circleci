/**
 * Online Profile
 * 送信プロフィール
 */
public with sharing class OutboundProfiles {
    private final OnlineProfileConfig__c config = OnlineProfileConfig__c.getOrgDefaults();
    private final OutboundProfile__c outProf;
    private List<OutboundProfile__c> memberOutProfs = new List<OutboundProfile__c>();
    private String exchangeProfileUrl;

    public OutboundProfiles(MyProfile__c myProf, Decimal viewCountLimit, Datetime viewExpirationDate, String password, Boolean isSendNotify) {
        if (config == null) {
            throw new OutboundProfilesException('カスタム設定を設定してください。');
        }
        if (myProf == null) {
            throw new OutboundProfilesException('マイプロフィールを指定してください。');
        }
        outProf = getOutboundProfile(myProf, null, viewCountLimit, viewExpirationDate, password, isSendNotify);
    }

    public void setMemberProfiles(List<MyProfile__c> memberMyProfs, Decimal viewCountLimit, Datetime viewExpirationDate, String password, Boolean isSendNotify) {
        memberOutProfs.clear();
        if (memberMyProfs == null) return;
        if (outProf == null) {
            throw new OutboundProfilesException('送信プロフィールを作成してください。');
        }

        for (MyProfile__c memberMyProf : memberMyProfs) {
            memberOutProfs.add(getOutboundProfile(memberMyProf, outProf.Id,viewCountLimit,viewExpirationDate,password,isSendNotify));
        }
    }

    private OutboundProfile__c getOutboundProfile(MyProfile__c myProf, Id parentId, Decimal viewCountLimit, Datetime viewExpirationDate, String password, Boolean isSendNotify) {
        OutboundProfile__c outProf = new OutboundProfile__c();
        outProf.MyProfile__c = myProf.Id;
        outProf.Parent__c = parentId;
        outProf.CompanyName__c = myProf.CompanyName__c;
        outProf.PostalCode__c = myProf.PostalCode__c;
        outProf.State__c = myProf.State__c;
        outProf.City__c = myProf.City__c;
        outProf.Street__c = myProf.Street__c;
        outProf.LastName__c = myProf.LastName__c;
        outProf.FirstName__c = myProf.FirstName__c;
        outProf.Department__c = myProf.Department__c;
        outProf.Title__c = myProf.Title__c;
        outProf.Email__c = myProf.Email__c;
        outProf.tel__c = myProf.tel__c;
        outProf.tel1__c = myProf.tel1__c;
        outProf.tel2__c = myProf.tel2__c;
        outProf.MobilePhone__c = myProf.MobilePhone__c;
        outProf.Message__c = myProf.Message__c;
        outProf.ImageUrl__c = UrlProofreader.fix(myProf.ImageUrl__c);
        outProf.CreatedDate__c = Datetime.now();
        outProf.ViewCount__c = 0;
        outProf.InboundProfileNotificationFlg__c = isSendNotify;
        if (String.isNotBlank(password)){
            outProf.Password__c = CryptUtil.createHashedPassword(password);
        }
        // Webサイト転記漏れ
        outProf.Website__c = myProf.Website__c;
        if (viewCountLimit != null) {
            outProf.ViewCountLimit__c = viewCountLimit;
        }
        if (viewExpirationDate != null) {
            outProf.ViewExpirationDate__c = viewExpirationDate;
        }
        return outProf;
    }

    public OutboundProfile__c getProfile() {
        return outProf;
    }

    public List<OutboundProfile__c> getMemberProfiles() {
        return memberOutProfs;
    }

    public void generateExchangeProfileUrl() {
        if (outProf == null) {
            throw new OutboundProfilesException('送信プロフィールを作成してください。');
        }
        if (String.isBlank(config.BaseUrl__c)) {
            throw new OutboundProfilesException('ベースURLを設定してください。');
        }
        String url = config.BaseUrl__c.removeEnd('/') + '/?' + CryptUtil.createEncryptedRecordId(outProf.Id);
        outProf.ExchangeProfileUrl__c = url;
        for (OutboundProfile__c memberOutProf : memberOutProfs) {
            memberOutProf.ExchangeProfileUrl__c = url;
        }
        exchangeProfileUrl = url;
    }

    public String getExchangeProfileUrl() {
        if (String.isBlank(exchangeProfileUrl)) {
            throw new OutboundProfilesException('プロフィール交換URLを生成してください。');
        }
        return exchangeProfileUrl;
    }

    public class OutboundProfilesException extends Exception {}
}