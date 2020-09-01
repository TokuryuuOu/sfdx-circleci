List<olPfSohoTest__MyProfile__c> mpList = [SELECT Id, OwnerId FROM olPfSohoTest__MyProfile__c ORDER BY Name LIMIT 3];
List<User> usList = [SELECT Id FROM User WHERE Name IN ('user01 user01','user02 user02','user03 user03') ORDER BY Name];
Integer idx = 0;
for (Integer idx = 0;idx < mpList.size();idx++) {
	mpList[idx].OwnerId = usList[idx].Id;
}
update mpList;