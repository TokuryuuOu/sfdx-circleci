Network myNetwork = [SELECT Id FROM Network WHERE Name ='Online Profile for Salesforce'];
ConnectApi.Community  myCommunity = ConnectApi.Communities.getCommunity(myNetwork.id);
olPfSohoTest__OnlineProfileConfig__c olProfCfg = new olPfSohoTest__OnlineProfileConfig__c();
olProfCfg.olPfSohoTest__BaseUrl__c = myCommunity.siteUrl;
insert olProfCfg;