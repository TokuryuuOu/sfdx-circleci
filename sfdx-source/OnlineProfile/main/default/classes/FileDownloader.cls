/**
 * ダウンローダ
 */
public abstract with sharing class FileDownloader {
    protected final String filename;

    public virtual String getContentDisposition() {
        return 'attachment;filename=' + filename;
    }

    public abstract String getContentType();
    public abstract String getBody();
}