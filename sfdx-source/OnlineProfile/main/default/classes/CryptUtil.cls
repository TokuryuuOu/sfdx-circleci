/**
 * 暗号化ユーティリティー
 */
public with sharing class CryptUtil {
    public static String createHashedPassword(String password) {
        Blob targetBlob = Blob.valueOf(password);
        Blob hash = Crypto.generateDigest('SHA-256', targetBlob);

        return EncodingUtil.convertToHex(hash);
    }

    public static String createEncryptedRecordId(String recordId) {
        Blob iv = Blob.valueOf(UserInfo.getOrganizationId().left(16));
        Blob key =Blob.valueOf((UserInfo.getOrganizationId()+UserInfo.getOrganizationId()).left(32));

        Blob data = Blob.valueOf(recordId);
        Blob encrypted = Crypto.encrypt('AES256', key, iv, data);

        return EncodingUtil.convertToHex(encrypted);
    }

    public static String decryptEncryptedRecordId(String encryptedRecordId) {
        try{
            Blob iv = Blob.valueOf(UserInfo.getOrganizationId().left(16));
            Blob key =Blob.valueOf((UserInfo.getOrganizationId()+UserInfo.getOrganizationId()).left(32));
    
            Blob blobValue = EncodingUtil.convertFromHex(encryptedRecordId);
            Blob decryptedRecordId = Crypto.decrypt('AES256', key, iv, blobValue);
    
            return decryptedRecordId.toString();            
        }catch(Exception ex){
            throw new CryptUtilException('プロフィールが見つかりません'); 
        }
    }
    
    public class CryptUtilException extends Exception {  
    }
    
}