/**
 * Abstract Selector
 * Test
 */
@IsTest
private with sharing class AbstractSelectorTest {
    @TestSetup
    private static void setup() {
        TestDataFactory.createAccountList(200);
    }

    @IsTest
    private static void selectById() {
        Set<Id> accIdSet = new Set<Id>();
        for (Account acc : TestDataFactory.getAccountList(200)) {
            accIdSet.add(acc.Id);
        }

        Test.startTest();

        TestSelector selector = new TestSelector();
        List<Account> accList = selector.selectById(accIdSet);

        Test.stopTest();

        System.assertEquals(200, accList.size());
    }

    private with sharing class TestSelector extends AbstractSelector {
        public TestSelector() {
            super();
            setOrderBy('Name ASC');
            setLimit(200);
            setOffset(0);
        }

        public override SObjectType getSObjectType() {
            return Account.sObjectType;
        }

        public override List<SObjectField> getSObjectFieldList() {
            return new List<SObjectField> { Account.Id, Account.Name };
        }

        public List<Account> selectById(Set<Id> accIdSet) {
            if (accIdSet == null || accIdSet.isEmpty()) return new List<Account>();

            String soql = String.format(
                'SELECT {0} FROM {1} WHERE Id IN :accIdSet'
                    + ' WITH SECURITY_ENFORCED'
                    + ' ORDER BY {2}'
                    + ' LIMIT {3} OFFSET {4}', new List<String> {

                    getFieldsString(),
                    getSObjectName(),
                    getOrderBy(),
                    getLimit(),
                    getOffset()
                }
            );
            return (List<Account>)Database.query(soql);
        }
    }
}