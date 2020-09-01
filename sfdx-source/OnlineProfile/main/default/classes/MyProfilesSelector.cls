/**
 * Online Profile
 * マイプロフィールSelector
 */
public with sharing class MyProfilesSelector extends AbstractSelector {
    private static final SObjectType SOBJECT_TYPE = MyProfile__c.sObjectType;

    private static final List<SObjectField> FIELD_LIST = new List<SObjectField> {
        MyProfile__c.Id, MyProfile__c.Name, MyProfile__c.OwnerId, MyProfile__c.IsDefault__c,
        MyProfile__c.CompanyName__c, MyProfile__c.PostalCode__c, MyProfile__c.State__c, MyProfile__c.City__c, MyProfile__c.Street__c,
        MyProfile__c.LastName__c, MyProfile__c.FirstName__c, MyProfile__c.Department__c, MyProfile__c.Title__c,
        MyProfile__c.Email__c, MyProfile__c.MobilePhone__c, MyProfile__c.Message__c, MyProfile__c.ImageUrl__c,
        MyProfile__c.ContentVersionId__c,MyProfile__c.Website__c, MyProfile__c.tel__c, MyProfile__c.tel1__c, MyProfile__c.tel2__c
    };

    private static final String DEFAULT_ORDER_BY = 'IsDefault__c DESC, LastModifiedDate DESC';

    public MyProfilesSelector() {
        super();
        setOrderBy(DEFAULT_ORDER_BY);
    }

    public override SObjectType getSObjectType() {
        return SOBJECT_TYPE;
    }

    public override List<SObjectField> getSObjectFieldList() {
        return FIELD_LIST;
    }

    public MyProfile__c selectById(Id profId) {
        if (profId == null) return null;

        String soql = String.format(
            'SELECT {0} FROM {1} WHERE Id = :profId'
                + ' WITH SECURITY_ENFORCED'
                + ' LIMIT 1', new List<String> {

                getFieldsString(),
                getSObjectName()
            }
        );
        for (SObject sobj : Database.query(soql)) {
            return (MyProfile__c)sobj;
        }
        return null;
    }

    public List<MyProfile__c> selectById(Set<Id> profIdSet) {
        if (profIdSet == null || profIdSet.isEmpty()) {
            return new List<MyProfile__c>();
        }

        String soql = String.format(
            'SELECT {0} FROM {1} WHERE Id IN :profIdSet'
                + ' WITH SECURITY_ENFORCED'
                + ' LIMIT {2}', new List<String> {

                getFieldsString(),
                getSObjectName(),
                getLimit()
            }
        );
        return (List<MyProfile__c>)Database.query(soql);
    }

    public MyProfile__c selectDefaultByOwnerId(Id ownerId) {
        if (ownerId == null) return null;

        String soql = String.format(
            'SELECT {0} FROM {1}'
                + ' WHERE OwnerId = :ownerId'
                + ' AND IsDefault__c = true'
                + ' WITH SECURITY_ENFORCED'
                + ' LIMIT 1', new List<String> {

                getFieldsString(),
                getSObjectName()
            }
        );
        for (SObject sobj : Database.query(soql)) {
            return (MyProfile__c)sobj;
        }
        return null;
    }

    public List<MyProfile__c> selectByOwnerId(Id ownerId) {
        if (ownerId == null) return null;

        String soql = String.format(
            'SELECT {0} FROM {1}'
                + ' WHERE OwnerId = :ownerId'
                + ' WITH SECURITY_ENFORCED'
                + ' Order by IsDefault__c Desc'
                + ' LIMIT 1000', new List<String> {
                getFieldsString(),
                getSObjectName()
            }
        );
        return (List<MyProfile__c>)Database.query(soql);
    }

    public List<MyProfile__c> selectDefaultByOwnerId(Set<Id> ownerIdSet, Set<Id> ignoreIdSet) {
        if (ownerIdSet == null || ownerIdSet.isEmpty()) return new List<MyProfile__c>();

        String soql = String.format(
            'SELECT {0} FROM {1}'
                + ' WHERE OwnerId IN :ownerIdSet'
                + ' AND Id NOT IN :ignoreIdSet'
                + ' AND IsDefault__c = true'
                + ' WITH SECURITY_ENFORCED'
                + ' ORDER BY {2} LIMIT {3}', new List<String> {

                getFieldsString(),
                getSObjectName(),
                getOrderBy(),
                getLimit()
            }
        );
        return (List<MyProfile__c>)Database.query(soql);
    }

    public List<MyProfile__c> selectBySearchString(String searchString, Boolean isDefault, Set<Id> ignoreIdSet) {
        // 条件未設定なら全データ表示
        //if (String.isBlank(searchString)) return new List<MyProfile__c>();
        String value = '%' + searchString + '%';

        String str = 'SELECT {0} FROM {1}';
        str = str + ' WHERE Id NOT IN :ignoreIdSet';
        // 「メインプロフィールに絞り込む」がTRUEのみ条件に追加
        if (isDefault){
            str = str + ' AND IsDefault__c = :isDefault';            
        }
        if (!String.isBlank(searchString)){
            // 条件に部署追加
            //str = str + ' AND (LastName__c LIKE :value OR FirstName__c LIKE :value OR Email__c LIKE :value)';
            str = str + ' AND (LastName__c LIKE :value OR FirstName__c LIKE :value OR Email__c LIKE :value OR Department__c LIKE :value)';
        }
        str = str + ' WITH SECURITY_ENFORCED';
        str = str + ' ORDER BY {2} LIMIT {3} OFFSET {4}';
        System.debug(str);
        String soql = String.format(
            str, new List<String> {
                getFieldsString(),
                getSObjectName(),
                'LastName__c ASC, FirstName__c ASC, Email__c ASC',
                getLimit(),
                getOffset()
            }
        );
        return (List<MyProfile__c>)Database.query(soql);
    }
}