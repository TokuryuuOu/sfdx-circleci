/**
 * Online Profile
 * 送信プロフィールSelector
 */
public with sharing class OutboundProfilesSelector extends AbstractSelector {
    private static final SObjectType SOBJECT_TYPE = OutboundProfile__c.sObjectType;

    private static final List<SObjectField> FIELD_LIST = new List<SObjectField> {
        OutboundProfile__c.Id, OutboundProfile__c.OwnerId, OutboundProfile__c.Parent__c,
        OutboundProfile__c.CompanyName__c, OutboundProfile__c.Website__c,
        OutboundProfile__c.PostalCode__c, OutboundProfile__c.State__c,
        OutboundProfile__c.City__c, OutboundProfile__c.Street__c,
        OutboundProfile__c.LastName__c, OutboundProfile__c.FirstName__c,
        OutboundProfile__c.Title__c, OutboundProfile__c.Department__c,
        OutboundProfile__c.Email__c, OutboundProfile__c.MobilePhone__c,
        OutboundProfile__c.Message__c, OutboundProfile__c.ImageUrl__c,
        OutboundProfile__c.ViewCount__c, OutboundProfile__c.ViewCountLimit__c,
        OutboundProfile__c.ViewExpirationDate__c, OutboundProfile__c.tel__c,
        OutboundProfile__c.tel1__c, OutboundProfile__c.tel2__c, OutboundProfile__c.Password__c
    };

    private static final String DEFAULT_ORDER_BY = 'CreatedDate ASC';

    public OutboundProfilesSelector() {
        super();
        setOrderBy(DEFAULT_ORDER_BY);
    }

    public override SObjectType getSObjectType() {
        return SOBJECT_TYPE;
    }

    public override List<SObjectField> getSObjectFieldList() {
        return FIELD_LIST;
    }

    public List<OutboundProfile__c> selectByParentId(Id parentId) {
        if (parentId == null) return new List<OutboundProfile__c>();

        String soql = String.format(
            'SELECT {0} FROM {1}'
                + ' WHERE Id = :parentId OR Parent__c = :parentId'
                + ' WITH SECURITY_ENFORCED'
                + ' ORDER BY {2} LIMIT {3}', new List<String> {

                getFieldsString(),
                getSObjectName(),
                'CompanyName__c,Parent__c NULLS FIRST, Title__c NULLS LAST, Department__c NULLS LAST,'
                    + ' LastName__c, FirstName__c, Email__c',
                getLimit()
            }
        );
        return (List<OutboundProfile__c>)Database.query(soql);
    }

    public List<OutboundProfile__c> selectByMyProfileId(Id myProfId) {
        if (myProfId == null) return new List<OutboundProfile__c>();

        String soql = String.format(
            'SELECT {0} FROM {1}'
                + ' WHERE MyProfile__c = :myProfId'
                + ' WITH SECURITY_ENFORCED'
                + ' ORDER BY {2} LIMIT {3}', new List<String> {

                getFieldsString(),
                getSObjectName(),
                'Parent__c NULLS FIRST, Title__c NULLS LAST, Department__c NULLS LAST,'
                    + ' LastName__c, FirstName__c, Email__c',
                getLimit()
            }
        );
        return (List<OutboundProfile__c>)Database.query(soql);
    }
}