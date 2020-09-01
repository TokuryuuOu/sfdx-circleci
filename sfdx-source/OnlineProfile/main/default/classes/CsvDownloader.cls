/**
 * Online Profile
 * CSVダウンローダ
 */
public with sharing class CsvDownloader extends FileDownloader {
    private final List<OutboundProfile__c> profList;
    private final String charset;
    private final String csvType;   // 0:取引先・取引先責任者　1:受信プロフィール　2:SmartVisca

    public CsvDownloader(List<OutboundProfile__c> profList, String filename, String charset, String csvType) {
        this.filename = filename;
        this.charset  = charset;
        this.profList = profList;
        this.csvType  = csvType;
    }

    public override String getContentType() {
        return 'text/csv;charset=' + charset + ';#' + filename;
    }

    public override String getBody() {
        String body = '';
        if (csvType == 'AC') {
            body =  getAccConBody();
        }else if (csvType == 'OP') {
            body =  getInboundProfileBody();
        }else if (csvType == 'SV') {
            body =  getSVBody();
        }
        return body;
    }

    private String getAccConBody() {
        String body = '"取引先名","Web サイト","郵便番号(郵送先)","都道府県(郵送先)","市区郡(郵送先)","町名・番地(郵送先)",'
        + '"姓","名","部署","役職","メール","電話","携帯"\r\n';
        for (OutboundProfile__c prof : profList) {
            CsvRecord record = new CsvRecord();
            record.addValue(prof.CompanyName__c);
            record.addValue(prof.Website__c);
            record.addValue(prof.PostalCode__c);
            record.addValue(prof.State__c);
            record.addValue(prof.City__c);
            record.addValue(prof.Street__c);
            record.addValue(prof.LastName__c);
            record.addValue(prof.FirstName__c);
            record.addValue(prof.Department__c);
            record.addValue(prof.Title__c);
            record.addValue(prof.Email__c);
            //電話番号1→電話番号2→代表電話番号 あったものを出す
            if (!String.isBlank(prof.tel1__c)){
                record.addValue(prof.tel1__c);
            }else if (!String.isBlank(prof.tel2__c)){
                record.addValue(prof.tel2__c);
            }else{
                record.addValue(prof.tel__c);
            }    
            record.addValue(prof.MobilePhone__c);
            body += record;
        }
        return body;
    }

    private String getInboundProfileBody() {
        //String body = '"会社名","姓","名","部署","役職","メール","電話番号","携帯電話","メッセージ","受信プロフィール作成日"\r\n';
        String body = '"姓","名","メール","携帯電話","電話番号1","電話番号2","部署","役職",'
        + '"会社名","代表電話番号","Web サイト","郵便番号","都道府県","市区郡","町名・番地","メッセージ"\r\n';
        for (OutboundProfile__c prof : profList) {
            CsvRecord record = new CsvRecord();
            record.addValue(prof.LastName__c);
            record.addValue(prof.FirstName__c);
            record.addValue(prof.Email__c);
            record.addValue(prof.MobilePhone__c);
            record.addValue(prof.tel1__c);
            record.addValue(prof.tel2__c);
            record.addValue(prof.Department__c);
            record.addValue(prof.Title__c);
            record.addValue(prof.CompanyName__c);
            record.addValue(prof.tel__c);
            record.addValue(prof.Website__c);
            record.addValue(prof.PostalCode__c);
            record.addValue(prof.State__c);
            record.addValue(prof.City__c);
            record.addValue(prof.Street__c);
            record.addValue(prof.Message__c);
            //record.addValue(DateTime.now().format('yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''));
            body += record;
        }
        return body;
    }
    /**
     * SmartViscaは名刺取り込み枚数での課金を実施しているため、
     * サービスモデルとの兼ね合いで組み込みを断念
     */
    private String getSVBody() {
        String body = '"会社名","URL","郵便番号","都道府県","住所","氏名",'
        + '"姓","名","所属","役職","メールアドレス","電話番号","携帯電話番号","メモ"\r\n';
        for (OutboundProfile__c prof : profList) {
            CsvRecord record = new CsvRecord();
            record.addValue(prof.CompanyName__c);
            record.addValue(prof.Website__c);
            record.addValue(prof.PostalCode__c);
            record.addValue(prof.State__c);
            record.addValue(prof.City__c + prof.Street__c);
            record.addValue(prof.LastName__c + ' ' + prof.FirstName__c);
            record.addValue(prof.LastName__c);
            record.addValue(prof.FirstName__c);
            record.addValue(prof.Department__c);
            record.addValue(prof.Title__c);
            record.addValue(prof.Email__c);
            record.addValue(prof.tel__c);
            record.addValue(prof.MobilePhone__c);
            record.addValue(prof.Message__c);
            body += record;
        }
        return body;
    }
}