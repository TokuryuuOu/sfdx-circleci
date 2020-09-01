require("chromedriver");
require("date-utils");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
const path = require('path')
var chrome    = require('selenium-webdriver/chrome');

// CI上で実行するときにオプションをつける。
// モニタリングするときはオプションを外す。
var options   = new chrome.Options().addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1920x1080');


let driver;
let iframe;

describe("SeleniumChromeTest", () => {
  before(() => {
    driver = new Builder().forBrowser('chrome').withCapabilities(options).build();
    
  });

  after(() => {
    // return driver.quit();
  });

  it("login salesforce", async () => {
    
    // 指定したURLに遷移する
    //環境情報を入力
    await driver.get("https://agility-dream-5451-dev-ed.cs117.my.salesforce.com/?startURL=lightning/n/OnlineProfileHomePage");
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')));
    await driver.findElement(By.id("username")).sendKeys('test-xdymfk9slhci@example.com')
    await driver.findElement(By.id("password")).sendKeys('38@TtD4en_')
    await driver.findElement(By.id("Login")).click();

    // 確認でたらここを戻す。
    // await driver.findElement(By.id("thePage:inputForm:continue")).click();

    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')));
    iframe = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'))

    await driver.switchTo().frame(iframe);


      //プロフィール作成
    await driver.wait(until.elementLocated(By.xpath('//input[@value="マイプロフィールを登録"]')));
    await driver.findElement(By.xpath('//input[@value="マイプロフィールを登録"]')).click()


    //プロフィール編集
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/form/div[3]/input[1]')));
    await driver.findElement(By.xpath('/html/body/div/form/div[3]/input[1]')).click()

    await driver.switchTo().defaultContent();

    //popup edit
    // await driver.wait(until.elementLocated(By.xpath('//button[@name="Edit"]')),10000);
    // await driver.findElement(By.xpath('//button[@name="Edit"]')).click()
    // await driver.wait(until.elementLocated(By.xpath('//input[@data-interactive-lib-uid="6"]')),10000);
    // await driver.findElement(By.xpath('//input[@data-interactive-lib-uid="6"]')).sendKeys('000-0000-0000')

    //direct edit
    const xpath = '/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___myprofile__c___view/forcegenerated-flexipage_default_rec_l_myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[1]/div/div/div/slot/force-record-layout-row[1]/slot/force-record-layout-item[1]/div/div/div[2]/button/span[1]'
    await driver.wait(until.elementLocated(By.xpath(xpath)),10000);
    await driver.findElement(By.xpath(xpath)).click()

    await driver.wait(until.elementLocated(By.xpath('//input[@name="LastName__c"]')),10000)
    const lastNameElm = await driver.findElement(By.xpath('//input[@name="LastName__c"]'))
    await lastNameElm.clear()
    await lastNameElm.sendKeys('tanaka')

    // await driver.wait(until.elementLocated(By.xpath('//name="Website__c"]')),10000)
    await driver.findElement(By.xpath('//input[@name="Website__c"]')).sendKeys('http://test.jp')
    // await driver.wait(until.elementLocated(By.xpath('//input[@name="LastName__c"]')),10000)
    await driver.findElement(By.xpath('//input[@name="Title__c"]')).sendKeys('開発者')
    await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),10000);
    await driver.findElement(By.xpath('//button[@title="保存"]')).click()

    await driver.sleep(2000)



    //画像アップロード アップできるときとできない時がある。とても不安定
    await driver.executeScript("window.scrollTo(0, 500)");
    const imgUploadIframe = "/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___myprofile__c___view/forcegenerated-flexipage_default_rec_l_myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[4]/div/div/div/slot/force-record-layout-row/slot/force-record-layout-item/div/div/div/span/slot[2]/force-aloha-page/div/iframe"

    iframe = await driver.findElement(By.xpath(imgUploadIframe))
    await driver.switchTo().frame(iframe);

    await driver.findElement(By.xpath('//input[@id="j_id0:page:j_id5"]')).sendKeys(path.join(process.cwd(),"e2eTest/testData/parrot.gif"))

    await driver.wait(until.elementLocated(By.id('saveButton')),3000);
    await driver.findElement(By.id('saveButton')).click()

    await driver.switchTo().defaultContent();

    await driver.findElement(By.xpath('//a[@href="/lightning/n/OnlineProfileHomePage"]/parent::*')).click()

  });

});

// 簡易スリープ
function sleep(waitMsec) {
  var startMsec = new Date();
 
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

//###########################
// classicでのファイルアップロードテスト
//###########################
// require("chromedriver");
// require("date-utils");
// require("jquery")
// const webdriver =  require("selenium-webdriver");
// const { Builder, By, until } = webdriver;
// const path = require('path')
// const assert = require("assert");
// var chrome    = require('selenium-webdriver/chrome');
// const http = require("selenium-webdriver/http")

// var options   = new chrome.Options()//.addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1920x1080');


// let driver;
// let iframe;

// async function getIframe(){

// }

// describe("SeleniumChromeTest", () => {
//   before(() => {
//     driver = new Builder().forBrowser('chrome').withCapabilities(options).build();
    
//   });

//   after(() => {
//     // return driver.quit();
//   });

//   it("login salesforce", async () => {

//     // 指定したURLに遷移する
//     await driver.get("https://agility-dream-5451-dev-ed.cs117.my.salesforce.com/?un=test-xdymfk9slhci@example.com&pw=X41Pgw1(Ow&startURL=a011m000001u6qa");

//     // // 要素を取得
//     // // await driver.findElement(By.id("username")).sendKeys('test-xdymfk9slhci@example.com')
//     // // await driver.findElement(By.id("password")).sendKeys('X41Pgw1(Ow')
//     // // await driver.findElement(By.id("Login")).click();

//     await driver.findElement(By.id("thePage:inputForm:continue")).click();

//     // await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')));
//     // iframe = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'))
 
//     // await driver.switchTo().frame(iframe);


//     //   //プロフィール作成
//     // await driver.wait(until.elementLocated(By.xpath('//input[@value="マイプロフィールを登録"]')),10000);
//     // await driver.findElement(By.xpath('//input[@value="マイプロフィールを登録"]')).click()

    
//     // //プロフィール編集
//     // await driver.wait(until.elementLocated(By.xpath('/html/body/div/form/div[3]/input[1]')));
//     // await driver.findElement(By.xpath('/html/body/div/form/div[3]/input[1]')).click()

//     // await driver.switchTo().defaultContent();

//     // await driver.wait(until.elementLocated(By.xpath('//button[@name="Edit"]')),10000);
//     // await driver.findElement(By.xpath('//button[@name="Edit"]')).click()
//     // // By.xpath("//img[@alt=\"社内業務\"]")

//     // await driver.wait(until.elementLocated(By.xpath('//input[@data-interactive-lib-uid="6"]')),10000);
//     // await driver.findElement(By.xpath('//input[@data-interactive-lib-uid="6"]')).sendKeys('000-0000-0000')

//     // await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),10000);
//     // await driver.findElement(By.xpath('//button[@title="保存"]')).click()

//     await driver.executeScript("window.scrollTo(0, 500)");


//         //画像アップロード
//     // const imgUploadIframe = "/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___myprofile__c___view/forcegenerated-flexipage_default_rec_l_myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[4]/div/div/div/slot/force-record-layout-row/slot/force-record-layout-item/div/div/div/span/slot[2]/force-aloha-page/div/iframe"
//     const imgUploadIframe = "/html/body/div[1]/div[2]/table/tbody/tr/td[2]/div[4]/div[2]/div[9]/table/tbody/tr/td/iframe"
//     iframe = await driver.findElement(By.xpath(imgUploadIframe))
//     await driver.switchTo().frame(iframe);
//     // const element =  await driver.findElement(By.xpath('//input[@id="j_id0:page:j_id5"]'))
//     // const action = driver.actions()
//     // await action.move(element).sendKeys(path.join(process.cwd(),"parrot.gif"))
//     await driver.findElement(By.xpath('//input[@id="j_id0:page:j_id5"]')).sendKeys(path.join(process.cwd(),"parrot.gif"))

//     await driver.wait(until.elementLocated(By.id('saveButton')),3000);
//     await driver.findElement(By.id('saveButton')).click()

//   });

// });