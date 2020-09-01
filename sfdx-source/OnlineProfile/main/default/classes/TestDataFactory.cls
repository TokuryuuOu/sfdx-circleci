/**
 * テストデータ作成
 */
@IsTest
public with sharing class TestDataFactory {
    private TestDataFactory() {}

    public static User getGuestUser() {
        return [SELECT Id FROM User WHERE UserType = 'Guest' LIMIT 1];
    }

    public static Account newAccount(String name, String website) {
        return new Account(
            Name = name,
            Website = website
        );
    }

    public static Account newAccount() {
        return newAccount('株式会社サンブリッジ', 'https://www.sunbridge.com');
    }

    public static List<Account> newAccountList(Integer count) {
        List<Account> accList = new List<Account>();
        for (Integer i = 0; i < count; i++) {
            String name = 'test' + i;
            String website = 'https://' + name + '.sunbridge.com';
            accList.add(newAccount(name, website));
        }
        return accList;
    }

    public static Account createAccount() {
        Account acc = newAccount();
        insert acc;
        return acc;
    }

    public static List<Account> createAccountList(Integer count) {
        List<Account> accList = newAccountList(count);
        insert accList;
        return accList;
    }

    public static List<Account> getAccountList(Integer count) {
        return [SELECT Id, Name, Website FROM Account LIMIT :count];
    }

    public static Account getAccount() {
        List<Account> accList = getAccountList(1);
        return (!accList.isEmpty()) ? accList.get(0) : null;
    }

    public static Contact newContact(Id accId) {
        return new Contact(
            AccountId = accId,
            LastName = '三部',
            FirstName = '律次',
            Email = 'sunb@example.com',
            Phone = '03-0000-0000',
            MobilePhone = '090-0000-0000',
            MailingPostalCode = '150-0022',
            MailingState = '東京都',
            MailingCity = '渋谷区',
            MailingStreet = '恵比寿南1-5-5\nJR恵比寿ビルB11F'
        );
    }

    public static Contact createContact(Id accId) {
        Contact con = newContact(accId);
        insert con;
        return con;
    }

    public static Contact getContact() {
        return [SELECT Id, LastName, FirstName, Account.Name, Department, Title, Email, Phone, MobilePhone,
            MailingPostalCode, MailingState, MailingCity, MailingStreet, Account.Website FROM Contact LIMIT 1];
    }

    public static ContentVersion newContentVersion() {
        return new ContentVersion(
            Title = 'test',
            VersionData = Blob.valueOf('test'),
            PathOnClient = 'test.png'
        );
    }

    public static ContentVersion createContentVersion() {
        ContentVersion cv = newContentVersion();
        insert cv;
        return cv;
    }

    public static ContentVersion getContentVersion() {
        return [SELECT Id, ContentDocumentId, Title, PathOnClient FROM ContentVersion LIMIT 1];
    }

    public static ContentDistribution newContentDistribution(ContentVersion cv) {
        return new ContentDistribution(
            ContentVersionId = cv.Id,
            Name = cv.Title
        );
    }

    public static ContentDistribution createContentDistribution(ContentVersion cv) {
        ContentDistribution cd = newContentDistribution(cv);
        insert cd;
        return cd;
    }

    public static ContentDistribution getContentDistribution() {
        return [SELECT Id, ContentDocumentId, ContentVersionId, Name FROM ContentDistribution LIMIT 1];
    }

    public static OnlineProfileConfig__c newConfig() {
        return new OnlineProfileConfig__c(
            BaseUrl__c = 'https://onlineprofile.example.com',
            DefaultViewCountLimit__c = 10,
            DefaultViewExpirationDays__c = 1
        );
    }

    public static OnlineProfileConfig__c createConfig() {
        OnlineProfileConfig__c config = newConfig();
        insert config;
        return config;
    }

    public static MyProfile__c newMyProfile(String lastName, String firstName, String email) {
        return new MyProfile__c(
            LastName__c = lastName,
            FirstName__c = firstName,
            Department__c = 'クラウドインテグレーション',
            Title__c = 'マネージャー',
            Email__c = email,
            MobilePhone__c = '090-0000-0000',
            tel__c = '03-0000-0000',
            tel1__c = '03-0000-0001',
            tel2__c = '03-0000-0002',
            CompanyName__c = '株式会社サンブリッジ',
            PostalCode__c = '150-0022',
            State__c = '東京都',
            City__c = '渋谷区',
            Street__c = '恵比寿南1-5-5\nJR恵比寿ビルB11F',
            IsDefault__c = true
        );
    }

    public static MyProfile__c newMyProfile() {
        return newMyProfile('三部', '律次', 'sunb@example.com');
    }

    public static List<MyProfile__c> newMyProfileList(Integer count) {
        List<MyProfile__c> profList = new List<MyProfile__c>();
        for (Integer i = 0; i < count; i++) {
            String lastName = 'test' + i;
            profList.add(newMyProfile(lastName, 'test', lastName + '@example.com'));
        }
        return profList;
    }

    public static MyProfile__c createMyProfile() {
        MyProfile__c prof = newMyProfile();
        insert prof;
        return prof;
    }

    public static List<MyProfile__c> createMyProfileList(Integer count) {
        List<MyProfile__c> profList = newMyProfileList(count);
        insert profList;
        return profList;
    }

    public static List<MyProfile__c> getMyProfileList(Integer count) {
        return [SELECT Id, OwnerId, IsDefault__c, LastName__c, FirstName__c, Department__c, Title__c,
            Email__c, MobilePhone__c, CompanyName__c, Website__c, tel__c, tel1__c, tel2__c,
            PostalCode__c, State__c, City__c, Street__c, 
            ImageUrl__c, ContentVersionId__c,Message__c
            FROM MyProfile__c LIMIT :count];
    }

    public static MyProfile__c getMyProfile() {
        List<MyProfile__c> profList = getMyProfileList(1);
        return (!profList.isEmpty()) ? profList.get(0) : null;
    }

    public static OutboundProfile__c newOutboundProfile(String lastName, String firstName, String email) {
        return new OutboundProfile__c(
            CreatedDate__c = Datetime.now(),
            LastName__c = lastName,
            FirstName__c = firstName,
            Department__c = 'クラウドインテグレーション',
            Title__c = 'マネージャー',
            Email__c = email,
            MobilePhone__c = '090-0000-0000',
            tel__c = '03-0000-0000',
            tel1__c = '03-0000-0001',
            tel2__c = '03-0000-0002',
            CompanyName__c = '株式会社サンブリッジ',
            PostalCode__c = '150-0022',
            State__c = '東京都',
            City__c = '渋谷区',
            Street__c = '恵比寿南1-5-5\nJR恵比寿ビルB11F'
        );
    }

    public static OutboundProfile__c newOutboundProfile() {
        return newOutboundProfile('三部', '律次', 'sunb@example.com');
    }

    public static List<OutboundProfile__c> newOutboundProfileList(Integer count) {
        List<OutboundProfile__c> profList = new List<OutboundProfile__c>();
        for (Integer i = 0; i < count; i++) {
            String lastName = 'test' + i;
            profList.add(newOutboundProfile(lastName, 'test', lastName + '@example.com'));
        }
        return profList;
    }

    public static OutboundProfile__c createOutboundProfile() {
        OutboundProfile__c prof = newOutboundProfile();
        insert prof;
        return prof;
    }

    public static List<OutboundProfile__c> createOutboundProfileList(Integer count) {
        List<OutboundProfile__c> profList = newOutboundProfileList(count);
        insert profList;
        return profList;
    }

    public static List<OutboundProfile__c> getOutboundProfileList(Integer count) {
        return [SELECT Id, OwnerId, Parent__c, LastName__c, FirstName__c, Department__c, Title__c,
            Email__c, MobilePhone__c, CompanyName__c, Website__c, tel__c, tel1__c, tel2__c,
            PostalCode__c, State__c, City__c, Street__c,  ImageUrl__c,
            ViewExpirationDate__c, ViewCountLimit__c, ViewCount__c, Message__c
            FROM OutboundProfile__c LIMIT :count];
    }

    public static OutboundProfile__c getOutboundProfile() {
        List<OutboundProfile__c> profList = getOutboundProfileList(1);
        return (!profList.isEmpty()) ? profList.get(0) : null;
    }

    public static InboundProfile__c getInboundProfile() {
        return [SELECT Id, CompanyName__c, LastName__c, FirstName__c, Email__c, MobilePhone__c, tel__c, tel1__c, tel2__c,
            PostalCode__c, State__c, City__c, Street__c, Website__c,
            Department__c, Title__c FROM InboundProfile__c LIMIT 1];
    }
}