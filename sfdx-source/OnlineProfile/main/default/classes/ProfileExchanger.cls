/**
 * Online Profile
 * プロフィール交換
 */
public with sharing class ProfileExchanger {
    private static final String NEWLINE = '\n';
    private static final String SEPARATOR = '------------------------------' + NEWLINE;
    private final OutboundProfile__c outProfile;
    private final List<OutboundProfile__c> outProfileList = new List<OutboundProfile__c>();
    private final Map<String,Map<Id, ProfileExchanger.OutProfile>> outProfileMaps = new Map<String,Map<Id, ProfileExchanger.OutProfile>>();
    private final String textProfiles;
    private final InboundProfile__c inProfile = new InboundProfile__c();

    public ProfileExchanger(List<OutboundProfile__c> outProfList) {
        if (outProfList == null) return;

        for (OutboundProfile__c outProf : outProfList) {
            if (outProfile == null && outProf.Parent__c == null) {
                outProfile = outProf;
            }
            outProfileList.add(outProf);
        }

        String txt = '';
        String companyName = '';
        Map<Id, ProfileExchanger.OutProfile> outProfileMap;
        for (OutboundProfile__c outProf : outProfList) {
            OutProfile prof = new OutProfile(outProf);
            if (companyName != outProf.CompanyName__c){
                companyName = outProf.CompanyName__c;
                outProfileMap = new Map<Id, ProfileExchanger.OutProfile>();
                outProfileMaps.put(companyName,outProfileMap);
            }
            outProfileMap.put(outProf.Id, prof);
            txt += prof + SEPARATOR;
        }
        textProfiles = txt.removeEnd(SEPARATOR);

        if (outProfile != null) {
            inProfile.OutboundProfile__c = outProfile.Id;
            inProfile.OwnerId = outProfile.OwnerId;
        }
    }

    public Boolean hasOutboundProfile() {
        return (outProfile != null);
    }

    /** 表示期限切れ */
    public Boolean isExpired() {
        if (outProfile == null) return false;
        if (outProfile.ViewExpirationDate__c < Datetime.now()
            || outProfile.ViewCount__c >= outProfile.ViewCountLimit__c) {

            return true;
        }
        return false;
    }

    public String getCompanyName() {
        return (outProfile != null) ? outProfile.CompanyName__c : null;
    }

    public OutboundProfile__c getOutboundProfile() {
        return outProfile;
    }

    public List<OutboundProfile__c> getOutboundProfileList() {
        return outProfileList;
    }

    public Map<String,Map<Id, ProfileExchanger.OutProfile>> getOutProfileMaps() {
        return outProfileMaps;
    }

    public String getTextProfiles() {
        return textProfiles;
    }

    public InboundProfile__c getInboundProfile() {
        return inProfile;
    }

    public String getPassword() {
        return (outProfile != null) ? outProfile.Password__c : null;
    }

    public with sharing class OutProfile {
        public final OutboundProfile__c profile { get; private set; }
        public final Field companyName { get; private set; }
        public final Field name { get; private set; }
        public final Field imageUrl { get; private set; }
        public final Field departmentAndTitle { get; private set; }
        public final Field message { get; private set; }
        public final Field mobilePhone { get; private set; }
        public final Field tel { get; private set; }
        public final Field tel1 { get; private set; }
        public final Field tel2 { get; private set; }
        public final Field email { get; private set; }
        public final Field postalCode { get; private set; }
        public final Field address { get; private set; }
        public final Field website { get; private set; }
        public final String text { get; private set; }
        public final String css { get; set; }

        private OutProfile(OutboundProfile__c prof) {
            this.profile = prof;
            this.companyName = new Field(prof.CompanyName__c);
            this.name = new Field((getValue(prof.LastName__c) + ' ' + getValue(prof.FirstName__c)).trim());
            this.imageUrl = new Field(prof.ImageUrl__c);
            this.departmentAndTitle = new Field((getValue(prof.Department__c) + ' - ' + getValue(prof.Title__c)).removeEnd(' - ').removeStart(' - '));
            this.message = new Field(prof.Message__c);
            this.mobilePhone = new Field(prof.MobilePhone__c);
            this.tel = new Field(prof.tel__c);
            this.tel1 = new Field(prof.tel1__c);
            this.tel2 = new Field(prof.tel2__c);
            this.email = new Field(prof.Email__c);
            this.postalCode = new Field(getValue(prof.PostalCode__c));
            this.address = new Field(getValue(prof.State__c) + getValue(prof.City__c) + getValue(prof.Street__c));
            this.website = new Field(prof.Website__c);
            this.text = toString();
        }

        private String getValue(String value) {
            return String.isNotBlank(value) ? value : '';
        }

        public override String toString() {
            if (String.isBlank(text)) {
                String body = '';
                if (companyName.isRender) body += companyName + NEWLINE;
                if (name.isRender) body += name + NEWLINE;
                if (departmentAndTitle.isRender) body += departmentAndTitle + NEWLINE;
                if (message.isRender) body += NEWLINE + message + NEWLINE + NEWLINE;
                if (mobilePhone.isRender) body += mobilePhone + NEWLINE;
                if (tel1.isRender) body += tel1 + NEWLINE;
                if (tel2.isRender) body += tel2 + NEWLINE;
                if (email.isRender) body += email + NEWLINE;
                if (postalCode.isRender) body += postalCode + NEWLINE;
                if (address.isRender) body += address + NEWLINE;
                if (tel.isRender) body += tel + NEWLINE;
                if (website.isRender) body += website + NEWLINE;
                return body;
            }
            return text;
        }
    }

    public with sharing class Field {
        public String value { get; private set; }
        public Boolean isRender { get; private set; }

        private Field(String val) {
            value = val;
            isRender = String.isNotBlank(value) ? true : false;
        }

        public override String toString() {
            return value;
        }
    }
}