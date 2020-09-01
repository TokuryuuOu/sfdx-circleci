/**
 * Online Profile
 * URL生成コントローラ
 */
public with sharing class UrlGeneratorController {
    private final OnlineProfileConfig__c config = OnlineProfileConfig__c.getOrgDefaults();
    public static final String URL_GENERATOR = 'URL生成';
    public static final String ADD_MEMBER = 'メンバー追加';
    public static final String URL_VIEW = 'URL出力';
    private static final Integer SEARCH_LIMIT = 20;
    private static final Decimal DEFAULT_VIEW_COUNT_LIMIT = 300;
    private static final Decimal DEFAULT_VIEW_EXPIRATION_DAYS = 14;
    /**
     * 2020.06.25 online profile修正内容のレビューと見積もり報告
     * カスタム設定への外出しを検討していたが、
     * わかりづらいため999件ハードコードする方針を決定
     */
    private static final Decimal DEFAULT_SEND_MEMBER_COUNT_LIMIT = 999;

    public String page { get; private set; }
    public Pager pager { get; private set; }
    public Boolean isClassic { get; private set; }
    public Boolean disabledGenButton { get; private set; }
    public Boolean disabledAddMemberButton { get; private set; }
    public Boolean disabledAddButton { get; private set; }
    public Boolean disabledDelButton { get; private set; }

    public final List<MyProfile> myProfList { get; private set; }
    public Boolean isDefault { get; set; }
    public String searchString { get; set; }
    public Boolean isSendNotify { get; set; }
    public final List<MyProfile> searchProfList { get; private set; }
    public String exchangeProfUrl { get; private set; }
    public Long viewCountLimit { get; set; }
    public Datetime viewExpirationDate { get; set; }
    public String  password { get; set; }
    public String message { get; set; }

    private final MyProfilesSelector selector = new MyProfilesSelector();
    private Integer searchProfListSize = 0;

    /** コンストラクタ */
    public UrlGeneratorController() {
        isDefault = true;
        isSendNotify = true;
        myProfList = new List<MyProfile>();
        searchProfList = new List<MyProfile>();
        pager = new Pager(SEARCH_LIMIT);
        page = URL_GENERATOR;
        isClassic = UiTheme.isClassic();
        
        try {
            disabledButtons();
            if (config.Id == null) {
                throw new UrlGeneratorControllerException('カスタム設定を設定してください。');
            }
            // カスタム設定値もチェック
            if (config.DefaultViewCountLimit__c <= 0 || 
                config.DefaultViewExpirationDays__c <= 0 ) {
                throw new UrlGeneratorControllerException('カスタム設定内容が不正です。システム管理者マニュアルに沿って設定を完了してください。');
            }
            Id sobjId = ApexPages.currentPage().getParameters().get('id');
            MyProfile__c myProf = selector.selectById(sobjId);
            // 選択されたアイテムを初期選択させる
            // if (myProf == null || myProf.OwnerId != UserInfo.getUserId()) {
            //     myProf = selector.selectDefaultByOwnerId(UserInfo.getUserId());
            // }
            if (myProf != null) {
                myProfList.add(new MyProfile(myProf, true));
            }
            viewCountLimit = (Long)((config.DefaultViewCountLimit__c != null)?config.DefaultViewCountLimit__c:DEFAULT_VIEW_COUNT_LIMIT);
            Decimal exp    = (config.DefaultViewExpirationDays__c != null)?config.DefaultViewExpirationDays__c:DEFAULT_VIEW_EXPIRATION_DAYS;
            ViewExpirationDate = Datetime.now().addDays(Integer.valueOf(exp));
            setButtons();
        } catch (Exception ex) {
            ApexPages.addMessages(ex);
        }
    }

    /** URL生成ページへ */
    public void generateUrlPage() {
        page = URL_GENERATOR;
    }

    /** メンバー追加ページへ */
    public void addMemberPage() {
        page = ADD_MEMBER;
        // 組織内の全ユーザ分を初期検索
        try {
            searchProf(pager.reset());
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    /** 検索 */
    public void searchProf() {
        try {
            searchProf(pager.reset());
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    /** 前へ */
    public void prevSearchProf() {
        try {
            searchProf(pager.prev());
            setButtons();
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    /** 次へ */
    public void nextSearchProf() {
        try {
            searchProf(pager.next());
            setButtons();
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    private void searchProf(Integer offset) {
        searchProfList.clear();
        // 条件未設定なら全データ表示
        // if (String.isBlank(searchString)) {
        //     setButtons();
        //     return;
        // }

        Set<Id> ignoreIdSet = new Set<Id>();
        for (MyProfile myProf : myProfList) {
            ignoreIdSet.add(myProf.prof.Id);
        }

        selector.setLimit(SEARCH_LIMIT+1);
        selector.setOffset(offset);
        for (MyProfile__c myProf : selector.selectBySearchString(searchString, isDefault, ignoreIdSet)) {
            searchProfList.add(new MyProfile(myProf));
        }
        searchProfListSize = searchProfList.size();
        if (searchProfListSize > SEARCH_LIMIT) {
            searchProfList.remove(searchProfList.size()-1);
        }
        setButtons();
    }

    /** メンバー追加 */
    public void addProf() {
        try {
            Boolean hasAdd = false;
            // 同時送信メンバー数制限対応
            Integer limitCnt = (Integer)DEFAULT_SEND_MEMBER_COUNT_LIMIT;
            Boolean isOver = false;
            for (MyProfile searchProf : searchProfList) {
                if (!searchProf.checked) continue;
                if (myProfList.size() == limitCnt){
                    isOver = true;
                    break;
                }
                myProfList.add(searchProf);
                hasAdd = true;
            }
            if (!hasAdd && !isOver) {
                throw new UrlGeneratorControllerException('プロフィールを選択してください。');
            }
            for (Integer i = searchProfList.size()-1; i >= 0; i--) {
                if (!searchProfList.get(i).checked) continue;
                searchProfList.remove(i);
            }
            for (MyProfile myProf : myProfList) {
                myProf.checked = false;
            }
            setButtons();
            page = URL_GENERATOR;
            if (isOver && hasAdd){
                throw new UrlGeneratorControllerException('選択可能なメンバー数の上限を超えたため、' + limitCnt + '件目まで追加しました。');
            }else if (isOver && !hasAdd){
                throw new UrlGeneratorControllerException('選択可能なメンバー数の上限 ' + limitCnt + '件を超えています。');
            }
        } catch (UrlGeneratorControllerException ex) {
            ApexPages.addMessages(ex);
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    /** メンバー該当行削除 */
    public PageReference deleteProf() {
        try {
            Integer rowNumber = Integer.valueOf(System.currentPageReference().getParameters().get('vf_rownumber'));
            myProfList.remove(rowNumber);
            setButtons();
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
        return null;
    }

    /** URL生成 */
    public void generateUrl() {
        try {
            if (myProfList.isEmpty()) {
                throw new UrlGeneratorControllerException('プロフィールを選択してください。');
            }

            MyProfile__c myProf = myProfList.get(0).prof;
            List<MyProfile__c> memberProfList = new List<MyProfile__c>();
            for (Integer i = 1; i < myProfList.size(); i++) {
                memberProfList.add(myProfList.get(i).prof);
            }
            OutboundProfiles outProfs = OutboundProfilesService.create(myProf, memberProfList, viewCountLimit, viewExpirationDate, password, isSendNotify);
            exchangeProfUrl = outProfs.getExchangeProfileUrl();
            page = URL_VIEW;
        } catch (UrlGeneratorControllerException ex) {
            ApexPages.addMessages(ex);
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    private void disabledButtons() {
        disabledGenButton = true;
        disabledAddMemberButton = true;
        disabledAddButton = true;
        disabledDelButton = true;
        // pager.setRenderLink('', 0);
    }

    private void setButtons() {
        disabledGenButton = myProfList.isEmpty() ? true : false;
        // 選択中のメンバー数が上限値以上なら追加選択不可に設定
        //disabledAddMemberButton = myProfList.isEmpty() ? true : false;
        Integer limitCnt = (Integer)DEFAULT_SEND_MEMBER_COUNT_LIMIT;
        disabledAddMemberButton = myProfList.size()>=limitCnt ? true : false;
        message = myProfList.size() + ' / ' + limitCnt + '人選択中';

        // 条件未入力検索を許容
        //if (String.isBlank(searchString) || searchProfList.isEmpty()) {
        if (searchProfList.isEmpty()) {
            disabledAddButton = true;
        } else {
            disabledAddButton = false;
        }
        // 最初の1人も消せるよう変更
        //disabledDelButton = (myProfList.size() <= 1) ? true : false;
        disabledDelButton = (myProfList.size() == 0) ? true : false;

        pager.setRenderLink(searchString, searchProfListSize);
    }

    public with sharing class MyProfile {
        public Boolean checked { get; set; }
        public final Boolean disabledCheckbox { get; private set; }
        public final MyProfile__c prof { get; private set; }

        private MyProfile(MyProfile__c myProf, Boolean disabledCheckbox) {
            // 自分のプロフィールでもチェック解除可能に
            this.checked = false;
            //this.checked = !disabledCheckbox;
            // 自分のプロフィールでもチェック解除可能に
            //this.disabledCheckbox = disabledCheckbox;
            this.prof = myProf;
        }

        @TestVisible
        private MyProfile(MyProfile__c myProf) {
            this(myProf, false);
        }
    }

    public class UrlGeneratorControllerException extends Exception {}
}