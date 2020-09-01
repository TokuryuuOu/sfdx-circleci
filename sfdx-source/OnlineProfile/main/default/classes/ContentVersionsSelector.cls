/**
 * コンテンツバージョンSelector
 */
public with sharing class ContentVersionsSelector extends AbstractSelector {
    private static final SObjectType SOBJECT_TYPE = ContentVersion.sObjectType;

    private static final List<SObjectField> FIELD_LIST = new List<SObjectField> {
        ContentVersion.Id, ContentVersion.ContentDocumentId,
        ContentVersion.Title, ContentVersion.FileType
    };

    public ContentVersionsSelector() {
        super();
    }

    public override SObjectType getSObjectType() {
        return SOBJECT_TYPE;
    }

    public override List<SObjectField> getSObjectFieldList() {
        return FIELD_LIST;
    }

    public ContentVersion selectById(Id cvId) {
        if (cvId == null) return null;

        String soql = String.format(
            'SELECT {0} FROM {1} WHERE Id = :cvId'
                + ' WITH SECURITY_ENFORCED'
                + ' LIMIT 1', new List<String> {

                getFieldsString(),
                getSObjectName()
            }
        );
        for (SObject sobj : Database.query(soql)) {
            return (ContentVersion)sobj;
        }
        return null;
    }
}