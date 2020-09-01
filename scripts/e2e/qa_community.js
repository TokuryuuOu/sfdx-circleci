require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
const path = require('path');
const imgUploadIframe = "/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___olPfSohoTest__myprofile__c___view/forcegenerated-flexipage_default_rec_l_olPfSohoTest__myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_olPfSohoTest__myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[4]/div/div/div/slot/force-record-layout-row/slot/force-record-layout-item/div/div/div/span/slot[2]/force-aloha-page/div/iframe"
const orgIframe = '//*[@id="setupComponent"]/div[2]/div/force-aloha-page/div/iframe';
const fs = require('fs');
const qaScratchInfo  = JSON.parse(fs.readFileSync("data/qa_scratch_info.json","utf-8"));
const mpInfo  = JSON.parse(fs.readFileSync("data/mp.json","utf-8"));
const npw = JSON.parse(fs.readFileSync("data/qa_scratch_pw.json","utf-8"));
const tag = JSON.parse(fs.readFileSync("data/beta_tag.json","utf-8"));
const orgJson = JSON.parse(fs.readFileSync('data/organization.json', 'utf8'));
var chrome = require('selenium-webdriver/chrome');

// CI上で実行するときにオプションをつける。モニタリングするときはオプションを外す。
var options = new chrome.Options().addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1024x768');

let driver;

describe("SeleniumChromeTest", () => {
  before(() => {
    driver = new Builder().forBrowser('chrome').withCapabilities(options).build();
  });

  after(() => {});

  it("login salesforce", async () => {
    let url = qaScratchInfo.result.loginUrl
              + "/secur/frontdoor.jsp?sid="
              + qaScratchInfo.result.accessToken;
    let un = qaScratchInfo.result.username;
    let opw = qaScratchInfo.result.password;

    // 指定したURLに遷移する
    await driver.get(url);
    // 環境情報を入力
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')),10000);
    await driver.findElement(By.id("username")).sendKeys(un);
    await driver.findElement(By.id("password")).sendKeys(opw);
    await driver.findElement(By.id("Login")).click();
    // パスワードを変更
    await driver.wait(until.elementLocated(By.id("currentpassword")),10000);
    await driver.findElement(By.id("currentpassword")).sendKeys(opw);
    await driver.findElement(By.id("newpassword")).sendKeys(npw.newPassword);
    await driver.findElement(By.id("confirmpassword")).sendKeys(npw.newPassword);
    await driver.findElement(By.id("answer")).sendKeys('東京');
    await driver.findElement(By.id("password-button")).click();
  });

  it("Change User Name", async () => {
    // ユーザー
    let usurl = qaScratchInfo.result.instanceUrl
    　　　　　　　　+ "/lightning/setup/ManageUsers/home";
    await driver.get(usurl);
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),10000);
    let iframe1 = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe1);
    await driver.wait(until.elementLocated(By.xpath('//a[text()="'+qaScratchInfo.result.username+'"]')),10000);
    await driver.findElement(By.xpath('//a[text()="'+qaScratchInfo.result.username+'"]')).click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),10000);
    let iframe2 = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe2);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="topButtonRow"]/input[1]')),10000);
    await driver.findElement(By.xpath('//*[@id="topButtonRow"]/input[1]')).click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),10000);
    let iframe3 = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe3);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="name_firstName"]')),10000);
    await driver.findElement(By.xpath('//*[@id="name_firstName"]')).clear();
    await driver.findElement(By.xpath('//*[@id="name_firstName"]')).sendKeys("/"+tag.betatag);
    await driver.findElement(By.xpath('//*[@id="bottomButtonRow"]/input[1]')).click();
    await driver.switchTo().defaultContent();
  });

  it("Change App Menu", async () => {
    // アプリケーションメニュー
    let appurl = qaScratchInfo.result.instanceUrl
    　　　　　　　　+ "/lightning/setup/AppMenu/home";
    await driver.get(appurl);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/div[2]/div[2]/div/div[1]/div/section/div/div[2]/div/div/div/div[2]/div/div/ul/section/ul/li[21]/div/div/div/div[2]/button')),10000);
    await driver.findElement(By.xpath('/html/body/div[4]/div[1]/div[2]/div[2]/div/div[1]/div/section/div/div[2]/div/div/div/div[2]/div/div/ul/section/ul/li[21]/div/div/div/div[2]/button')).click();
  });

  it("Change Org Info", async () => {
    // 組織情報変更
    let orgurl = qaScratchInfo.result.instanceUrl
    　　　　　　　　+ "/lightning/setup/CompanyProfileInfo/home";
    await driver.get(orgurl);
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),10000);
    let iframe1 = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe1);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="bottomButtonRow"]/input[1]')),10000);
    await driver.findElement(By.xpath('//*[@id="topButtonRow"]/input[1]')).click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),10000);
    let iframe2 = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe2);
    await driver.wait(until.elementLocated(By.id("Division")),10000);
    await driver.findElement(By.id("Division")).sendKeys(orgJson.records[0].Division);
    await driver.findElement(By.id("Phone")).sendKeys(orgJson.records[0].Phone);
    await driver.findElement(By.id("Fax")).sendKeys(orgJson.records[0].Fax);
    await driver.findElement(By.id("Addresszip")).sendKeys(orgJson.records[0].PostalCode);
    await driver.findElement(By.id("Addressstate")).sendKeys(orgJson.records[0].State);
    await driver.findElement(By.id("Addresscity")).sendKeys(orgJson.records[0].City);
    await driver.findElement(By.id("Addressstreet")).sendKeys(orgJson.records[0].Street);
    await driver.findElement(By.xpath('//*[@id="bottomButtonRow"]/input[1]')).click();
    await driver.switchTo().defaultContent();
  });

  it("Upload Img", async () => {
    // myprofile 画像登録
    let mpurl1 = qaScratchInfo.result.instanceUrl
                 + "/lightning/r/olPfSohoTest__MyProfile__c/"
                 + mpInfo.result.records[0].Id
                 + "/view";
    await driver.get(mpurl1);
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),10000);
    let iframe1 = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe1);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),10000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),10000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.switchTo().defaultContent();

    let mpurl2 = qaScratchInfo.result.instanceUrl
                 + "/lightning/r/olPfSohoTest__MyProfile__c/"
                 + mpInfo.result.records[1].Id
                 + "/view";
    await driver.get(mpurl2);
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),10000);
    let iframe2 = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe2);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),10000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),10000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.switchTo().defaultContent();

    let mpurl3 = qaScratchInfo.result.instanceUrl
                 + "/lightning/r/olPfSohoTest__MyProfile__c/"
                 + mpInfo.result.records[2].Id
                 + "/view";
    await driver.get(mpurl3);
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),10000);
    let iframe3 = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe3);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),10000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),10000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.switchTo().defaultContent();
  });
});