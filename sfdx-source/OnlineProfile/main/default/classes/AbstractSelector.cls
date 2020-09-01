/**
 * Abstract Selector
 */
public abstract with sharing class AbstractSelector {
    private final String sObjectName;
    private final String fieldsString;
    private String orderBy = 'LastModifiedDate DESC, CreatedDate DESC';
    private String queryLimit = '100';
    private String offset = '0';

    public AbstractSelector() {
        DescribeSObjectResult sObjectResult = getSObjectType().getDescribe();
        sObjectName = sObjectResult.getName();
        if (!sObjectResult.isAccessible()) {
            throw new AbstractSelectorException(sObjectName + ': SObject access denied');
        }

        Map<String, SObjectField> fieldMap = sObjectResult.fields.getMap();
        List<String> fieldList = new List<String>();
        for (SObjectField field : getSObjectFieldList()) {
            DescribeFieldResult fieldResult = field.getDescribe();
            String fieldName = fieldResult.getName();
            if (!fieldResult.isAccessible()) {
                throw new AbstractSelectorException(sObjectName + '.' + fieldName + ': Fields access denied');
            }
            fieldList.add(fieldName);
        }
        fieldsString = String.join(fieldList, ',');
    }

    public abstract SObjectType getSObjectType();
    public abstract List<SObjectField> getSObjectFieldList();

    public String getSObjectName() {
        return sObjectName;
    }

    public String getFieldsString() {
        return fieldsString;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String s) {
        orderBy = s;
    }

    public String getLimit() {
        return queryLimit;
    }

    public void setLimit(Integer n) {
        queryLimit = String.valueOf(n);
    }

    public String getOffset() {
        return offset;
    }

    public void setOffset(Integer n) {
        offset = String.valueOf(n);
    }

    public class AbstractSelectorException extends Exception {}
}