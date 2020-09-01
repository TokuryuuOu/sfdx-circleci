/**
 * Online Profile
 * 画像登録コントローラ
 */
public with sharing class ImageRegisterController {
    public MyProfile__c myProfile { get; private set; }
    public String imageUrl { get; private set; }
    public final ContentVersion contentVersion { get; set; }

    public ImageRegisterController(ApexPages.StandardController stdController) {
        try {
            if (!Test.isRunningTest()) {
                stdController.addFields(new List<String> { 'ContentVersionId__c', 'ImageUrl__c' });
            }
            myProfile = (MyProfile__c)stdController.getRecord();
            imageUrl = UrlProofreader.fix(myProfile.ImageUrl__c);
            contentVersion = new ContentVersion();
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    public void save() {
        try {
            if (contentVersion.VersionData == null) {
                throw new ImageRegisterControllerException('画像を選択してください');
            }

            ImageRegisterService.Image registImage = new ImageRegisterService.Image(myProfile, contentVersion);
            registImage = ImageRegisterService.upsertImage(registImage);
            myProfile = registImage.prof;
            imageUrl = UrlProofreader.fix(myProfile.ImageUrl__c);
            // ビューステートサイズオーバー対策、アップロード成功時にはVersionDataをNullにしておく
            contentVersion.VersionData = null;

        } catch (ImageRegisterControllerException ex) {
            PagesMessage.warn(ex);
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    public void deleteImage() {
        try {
            if (imageUrl == null) {
                throw new ImageRegisterControllerException('画像がアップロードされていません。');
            }
            ImageRegisterService.Image registImage = new ImageRegisterService.Image(myProfile, contentVersion);
            registImage = ImageRegisterService.deleteImage(registImage);
            myProfile = registImage.prof;
            imageUrl = null;

        } catch (ImageRegisterControllerException ex) {
            PagesMessage.warn(ex);
        } catch (Exception ex) {
            PagesMessage.error(ex);
        }
    }

    public class ImageRegisterControllerException extends Exception {}
}