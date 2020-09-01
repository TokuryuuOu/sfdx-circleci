/**
 * コンテンツ配信Selector
 */
public with sharing class ContentDistributionsSelector extends AbstractSelector {
    private static final SObjectType SOBJECT_TYPE = ContentDistribution.sObjectType;

    private static final List<SObjectField> FIELD_LIST = new List<SObjectField> {
        ContentDistribution.Id, ContentDistribution.ContentDocumentId,
        ContentDistribution.ContentVersionId, ContentDistribution.DistributionPublicUrl
    };

    public ContentDistributionsSelector() {
        super();
    }

    public override SObjectType getSObjectType() {
        return SOBJECT_TYPE;
    }

    public override List<SObjectField> getSObjectFieldList() {
        return FIELD_LIST;
    }

    public ContentDistribution selectById(Id cdId) {
        if (cdId == null) return null;

        String soql = String.format(
            'SELECT {0} FROM {1} WHERE Id = :cdId'
                + ' WITH SECURITY_ENFORCED'
                + ' LIMIT 1', new List<String> {

                getFieldsString(),
                getSObjectName()
            }
        );
        for (SObject sobj : Database.query(soql)) {
            return (ContentDistribution)sobj;
        }
        return null;
    }
}