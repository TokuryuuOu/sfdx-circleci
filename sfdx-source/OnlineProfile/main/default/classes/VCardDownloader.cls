/**
 * Online Profile
 * vCardダウンローダ
 */
public with sharing class VCardDownloader extends FileDownloader {
    private final List<OutboundProfile__c> profList;
    private final String charset;

    public VCardDownloader(List<OutboundProfile__c> profList, String filename, String charset) {
        this.filename = filename;
        this.profList = profList;
        this.charset = charset;
    }

    public override String getContentType() {
        return 'text/x-vcard;charset=' + charset + ';#' + filename;
    }

    public override String getBody() {
        String body = '';
        for (OutboundProfile__c prof : profList) {
            VCard vc = new VCard();
            vc.setN(prof.LastName__c, prof.FirstName__c);
            vc.setOrg(prof.CompanyName__c);
            vc.setEmail(prof.Email__c);
            vc.setTel1(prof.tel1__c);
            vc.setTel(prof.tel__c);
            vc.setCell(prof.MobilePhone__c);
            vc.setAdr(null, prof.PostalCode__c, prof.State__c, prof.City__c, prof.Street__c);
            vc.setUrl(prof.Website__c);
            body += vc + VCard.NEWLINE;
        }
        return body.removeEnd(VCard.NEWLINE);
    }
}