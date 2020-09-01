/**
 * CRUD and FLSチェッカー
 */
public with sharing class CrudFlsChecker {
    private CrudFlsChecker() {}

    public static List<SObject> check(AccessType accessType, List<SObject> sobjList) {
        if (sobjList == null || sobjList.isEmpty()) return sobjList;

        SObjectAccessDecision decision;
        try {
            decision = Security.stripInaccessible(accessType, sobjList, true);
        } catch (NoAccessException ex) {
            String sobjName = sobjList.get(0).getSObjectType().getDescribe().getName();
            throw new CrudFlsCheckerException(sobjName + ': SObject access denied');
        }

        Map<String, Set<String>> removeFields = decision.getRemovedFields();
        if (!removeFields.keySet().isEmpty()) {
            List<String> fieldList = new List<String>();
            for (String sobjName : removeFields.keySet()) {
                for (String fieldName : removeFields.get(sobjName)) {
                    fieldList.add(sobjName + '.' + fieldName);
                }
            }
            String fieldsString = String.join(fieldList, ',');
            throw new CrudFlsCheckerException(fieldsString + ': Fields access denied');
        }
        return sobjList;
    }

    public static SObject check(AccessType accessType, SObject sobj) {
        if (sobj == null) return null;
        List<SObject> sobjList = check(accessType, new List<SObject> { sobj });
        return sobjList.isEmpty() ? null : sobjList.get(0);
    }

    public static List<SObject> checkCreate(List<SObject> sobjList) {
        return check(AccessType.CREATABLE, sobjList);
    }

    public static SObject checkCreate(SObject sobj) {
        return check(AccessType.CREATABLE, sobj);
    }

    public static List<SObject> checkRead(List<SObject> sobjList) {
        return check(AccessType.READABLE, sobjList);
    }

    public static SObject checkRead(SObject sobj) {
        return check(AccessType.READABLE, sobj);
    }

    public static List<SObject> checkUpdate(List<SObject> sobjList) {
        return check(AccessType.UPDATABLE, sobjList);
    }

    public static SObject checkUpdate(SObject sobj) {
        return check(AccessType.UPDATABLE, sobj);
    }

    public static List<SObject> checkUpsert(List<SObject> sobjList) {
        return check(AccessType.UPSERTABLE, sobjList);
    }

    public static SObject checkUpsert(SObject sobj) {
        return check(AccessType.UPSERTABLE, sobj);
    }

    public static List<SObject> checkDelete(List<SObject> sobjList) {
        if (sobjList == null || sobjList.isEmpty()) return sobjList;

        DescribeSObjectResult sobjResult = sobjList.get(0).getSObjectType().getDescribe();
        if (!sobjResult.isDeletable()) {
            String sobjName = sobjResult.getName();
            throw new CrudFlsCheckerException(sobjName + ': SObject access denied');
        }
        return sobjList;
    }

    public static SObject checkDelete(SObject sobj) {
        if (sobj == null) return null;
        List<SObject> sobjList = checkDelete(new List<SObject> { sobj });
        return sobjList.isEmpty() ? null : sobjList.get(0);
    }

    public class CrudFlsCheckerException extends Exception {}
}