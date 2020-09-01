/**
 * Online Profile
 * 画像登録Service
 */
public with sharing class ImageRegisterService {
    /**
     * 画像登録/更新
     */
    public static Image upsertImage(Image registImage) {
        Savepoint sp = Database.setSavepoint();
        try {
            MyProfile__c prof = registImage.prof;
            ContentVersion conVer = registImage.conVer;

            // コンテンツバージョン作成
            ContentVersionsSelector conVerSelector = new ContentVersionsSelector();
            ContentVersion oldConVer = conVerSelector.selectById(prof.ContentVersionId__c);
            ContentVersion newConVer = new ContentVersion(
                VersionData = conVer.VersionData,
                PathOnClient = conVer.PathOnClient
            );

            if (oldConVer != null) {
                newConVer.ContentDocumentId = oldConVer.ContentDocumentId;
                newConVer.Title = newConVer.PathOnClient.substringBeforeLast('.');
            } else {
                newConVer.FirstPublishLocationId = prof.Id;
            }
            createSObject(new List<SObject> { newConVer });
            newConVer = conVerSelector.selectById(newConVer.Id);

            // コンテンツ配信作成
            ContentDistribution newConDist = new ContentDistribution(
                ContentVersionId = newConVer.Id,
                Name = newConVer.Title,
                PreferencesPasswordRequired = false
            );
            createSObject(new List<SObject> { newConDist });
            newConDist = new ContentDistributionsSelector().selectById(newConDist.Id);

            // マイプロフィール更新
            MyProfile__c updProf = new MyProfile__c(
                Id = prof.Id,
                ContentVersionId__c = newConVer.Id,
                FileType__c = newConVer.FileType,
                ImageUrlParameter__c = newConDist.DistributionPublicUrl.substringAfter('/a/')
            );
            updateSObject(new List<SObject> { updProf });
            registImage.prof = new MyProfilesSelector().selectById(prof.Id);
            return registImage;
        } catch (Exception ex) {
            Database.rollback(sp);
            throw ex;
        }
    }

    /**
     * 画像削除
     */
    public static Image deleteImage(Image registImage) {
        MyProfile__c prof = registImage.prof;
        Savepoint sp = Database.setSavepoint();
        try {
            //コンテンツドキュメント削除
            ContentVersionsSelector conVerSelector = new ContentVersionsSelector();
            ContentVersion currentConVer = conVerSelector.selectById(prof.ContentVersionId__c);
            ContentDocument currentConDoc = new ContentDocument(Id=currentConVer.ContentDocumentId);
            deleteSObject(new List<SObject> { currentConDoc });
            
            //マイプロフィール更新
            MyProfile__c updProf = new MyProfile__c(
                    Id = prof.Id,
                    ContentVersionId__c = null,
                    FileType__c = null,
                    ImageUrlParameter__c = null
                );
            updateSObject(new List<SObject> { updProf });

            //送信プロフィール更新(あれば)
            List<OutboundProfile__c> outProfList = new OutboundProfilesSelector().selectByMyProfileId(prof.Id);
            for ( OutboundProfile__c outProf:outProfList ){
                outProf.ImageUrl__c = null;
            }
            updateSObject(outProfList);
            registImage.prof = new MyProfilesSelector().selectById(prof.Id);
            return registImage;
        } catch (Exception ex) {
            Database.rollback(sp);
            throw ex;
        }
    }

    /* 複数処理する形にしないとCode Scannerを通せない */
    private static List<Database.SaveResult> createSObject(List<SObject> sobjList) {
        return Database.insert(CrudFlsChecker.checkCreate(sobjList), true);
    }

    private static List<Database.SaveResult> updateSObject(List<SObject> sobjList) {
        return Database.update(CrudFlsChecker.checkUpdate(sobjList), true);
    }

    private static List<Database.DeleteResult> deleteSObject(List<SObject> sobjList) {
        return Database.delete(CrudFlsChecker.checkDelete(sobjList), true);
    }

    public with sharing class Image {
        public MyProfile__c prof { get; set; }
        public final ContentVersion conVer { get; private set; }

        public Image(MyProfile__c prof, ContentVersion conVer) {
            this.prof = prof;
            this.conVer = conVer;
        }
    }

    public class ImageRegisterServiceException extends Exception {}
}