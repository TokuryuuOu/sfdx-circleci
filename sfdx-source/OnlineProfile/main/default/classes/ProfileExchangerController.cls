/**
 * Online Profile
 * プロフィール交換コントローラ
 */
public with sharing class ProfileExchangerController {
    private static final String CSV_FILE_PREFIX_AC = 'Accounts_';
    private static final String CSV_FILE_PREFIX_OP = 'Profiles_';
    private static final String CSV_FILE_SUFFIX = '.csv';
    private static final String CSV_CHARSET = 'Windows-31J';
    private static final String VCARD_CHARSET = 'UTF-8';

    public final ProfileExchanger profileExchanger { get; private set; }
    public final String companyName { get; private set; }
    public final Map<String,Map<Id, ProfileExchanger.OutProfile>> outProfileMaps{ get; private set; }
    public String textProfiles { get; set; }
    public String outProfileId { get; set; }
    public FileDownloader fileDownloader { get; private set; }
    public final InboundProfile__c inProfile { get; private set; }
    public Boolean hasError { get; private set; }
    public Boolean isReturned { get; private set; }
    public Boolean hasPassword { get; private set; }
    public Boolean okPassword { get; private set; }
    public String savedPassword { get; private set; }
    public String inputPassword { get; set; }
    public Id outProfId { get; private set; }
    public String csvType { get;set; }
    public String dataColumnCss { get;set; }

    public ProfileExchangerController() {
        try {
            if (outProfId == null){
                for (String key : ApexPages.currentPage().getParameters().keySet()) {
                    outProfId = CryptUtil.decryptEncryptedRecordId(key);
                    break;
                }
            }

            profileExchanger = new ProfileExchanger(new OutboundProfilesSelector().selectByParentId(outProfId));
            isReturned = false;
            companyName = profileExchanger.getCompanyName();
            outProfileMaps = profileExchanger.getOutProfileMaps();
            textProfiles = profileExchanger.getTextProfiles();
            inProfile = profileExchanger.getInboundProfile();
            savedPassword = profileExchanger.getPassword();
            hasPassword = (savedPassword != null);
            if ( hasPassword && savedPassword == inputPassword ){
                okPassword = true;
            }else if(!hasPassword){
                okPassword = true;
            }else{
                okPassword = false;
            }
            Set<String> keys = outProfileMaps.keySet();
            for (String key : keys){
                if (outProfileMaps.get(key).size() == 1){
                    Set<Id> idSet = outProfileMaps.get(key).keySet();
                    for (Id id:idSet){
                        //表示するプロフィールが1社あたり1つだけだった場合のアイテムの中央寄せを実現するために止むを得ずCSSをコントローラで設定しています
                        ((ProfileExchanger.OutProfile)(outProfileMaps.get(key).get(id))).css = 'uk-first-column uk-scrollspy-inview uk-animation-fade uk-margin-auto';
                    }
                }
            }
        } catch (CryptUtil.CryptUtilException ex) {
            PagesMessage.warn(ex);
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    public void init() {
        try {
            if (profileExchanger == null || !profileExchanger.hasOutboundProfile()) {
                throw new ProfileExchangerControllerException('プロフィールが見つかりません');
            }
            if (profileExchanger.isExpired()) {
                throw new ProfileExchangerControllerException('表示期限が過ぎました');
            }
            ProfileExchangerService.updateViewCount(profileExchanger.getOutboundProfileList());
        } catch (ProfileExchangerControllerException ex) {
            PagesMessage.warn(ex);
            hasError = true;
        } catch (Exception ex) {
            PagesMessage.error(ex);
            hasError = true;
        }
    }
    
    /** パスワード認証 */
    public PageReference sendPassword() {
        if (savedPassword == CryptUtil.createHashedPassword(inputPassword)){
            okPassword = true;
        }else{
            ProfileExchangerControllerException ex = new ProfileExchangerControllerException('パスワードが正しくありません。');
            PagesMessage.warn(ex);
        }
        return null;
    }

    /** プロフィール一覧ページへ */
    public PageReference viewPage() {
        Pagereference pr = Page.ProfileExchanger.setRedirect(false);
        return pr;
    }

    /** プロフィールを送り返すページへ */
    public PageReference inputPage() {
        Pagereference pr = Page.ProfileExchangerReply.setRedirect(false);
        return pr;
    }

    /** メッセージページへ */
    public PageReference messagePage() {
        Pagereference pr = Page.ProfileExchangerMessage.setRedirect(false);
        return pr;
    }

    /** 電話帳登録 */
    public PageReference downloadVCard() {
        try {
            if (String.isBlank(outProfileId)) {
                throw new ProfileExchangerControllerException('outbound profile id is empty');
            }
            ProfileExchanger.OutProfile vCardProf;
            Set<String> keys = outProfileMaps.keySet();
            for (String key : keys){
                Map<Id, ProfileExchanger.OutProfile> outProfileMap = outProfileMaps.get(key);
                if (outProfileMap.containsKey(outProfileId)){
                    vCardProf = outProfileMap.get(outProfileId);
                    break;
                }
            }
            if (vCardProf == null) {
                throw new ProfileExchangerControllerException(outProfileId + ': not found');
            }

            List<OutboundProfile__c> vCardProfList = new List<OutboundProfile__c> { vCardProf.profile };
            String filename = vCardProf.email + '.vcf';
            fileDownloader = new VCardDownloader(vCardProfList, filename, VCARD_CHARSET);
            Page.FileDownloader.getHeaders().put('Content-Disposition', fileDownloader.getContentDisposition());
            return Page.FileDownloader;
        } catch (Exception ex) {
            hasError = true;
            PagesMessage.error(ex);
            return null;
        }
    }

    /** CSVダウンロード */
    public PageReference downloadCsv() {
        try {
            String fileName;
            String dt = DateTime.now().format('yyyyMMddHHmmss');
            if (csvType == 'AC'){
                fileName = CSV_FILE_PREFIX_AC + dt + CSV_FILE_SUFFIX;
            }else if (csvType == 'OP'){
                fileName = CSV_FILE_PREFIX_OP + dt + CSV_FILE_SUFFIX;
            }
            fileDownloader = new CsvDownloader(profileExchanger.getOutboundProfileList(), fileName, CSV_CHARSET, csvType);
            Page.FileDownloader.getHeaders().put('Content-Disposition', fileDownloader.getContentDisposition());
            return Page.FileDownloader;
        } catch (Exception ex) {
            hasError = true;
            PagesMessage.error(ex);
            return null;
        }
    }

    /** プロフィール送信 */
    public PageReference saveInboundProfile() {
        try {
            ProfileExchangerService.createInboundProfile(new List<InboundProfile__c> { inProfile });
            PagesMessage.info('プロフィールの送信');
            PagesMessage.info('ありがとうございました');
            isReturned = true;
            return messagePage();
        } catch (Exception ex) {
            PagesMessage.error(ex);
            hasError = true;
            return null;
        }
    }

    public class ProfileExchangerControllerException extends Exception {}
}