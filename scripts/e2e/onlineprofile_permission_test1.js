require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
const path = require('path');
const imgUploadIframe = "/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___olPfSohoTest__myprofile__c___view/forcegenerated-flexipage_default_rec_l_olPfSohoTest__myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_olPfSohoTest__myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[4]/div/div/div/slot/force-record-layout-row/slot/force-record-layout-item/div/div/div/span/slot[2]/force-aloha-page/div/iframe"
const fs = require('fs');
const orgIframe = '//*[@id="setupComponent"]/div[2]/div/force-aloha-page/div/iframe';
const qaScratchInfo  = JSON.parse(fs.readFileSync("data/qa_scratch_info.json","utf-8"));
const npw = JSON.parse(fs.readFileSync("data/qa_scratch_pw.json","utf-8"));
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

    // 指定したURLに遷移する
    await driver.get(url);
    // 環境情報を入力
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')),15000);
    await driver.findElement(By.id("username")).sendKeys(un);
    await driver.findElement(By.id("password")).sendKeys(npw.newPassword);
    await driver.findElement(By.id("Login")).click();
  });

  it("permissionset myprofile case", async () => {
    let el;
    let iframe;
    let windows;
    let otherWindow;

    // テスト用権限セットに変換
    await driver.get(qaScratchInfo.result.instanceUrl+"/lightning/setup/ManageUsers/home");
    await driver.sleep(15000);
    const originalWindow = await driver.getWindowHandle();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="'+qaScratchInfo.result.username+'"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="editPermSetAssignments"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//option[@title="Online Profile内部ユーザ"]')),15000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//img[@alt="削除"]')),15000);
    await el.findElement(By.xpath("../../a")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="editPermSetAssignments"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//option[@title="Online Profile内部ユーザ テスト"]')),15000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//img[@alt="追加"]')),15000);
    await el.findElement(By.xpath("../../a")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();

    // マイプロフィール
    await driver.executeScript('window.open("'+qaScratchInfo.result.instanceUrl+'/lightning/o/olPfSohoTest__MyProfile__c/home");');
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,15000);
    windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        otherWindow = handle;
      }
    });
    await driver.sleep(15000);
    await driver.switchTo().window(otherWindow);
    el = await driver.wait(until.elementLocated(By.xpath('//a[@title="新規"]')),15000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="姓"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("姓");
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="名"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("名");
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="メール"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("test@test.com");
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="プロフィール名"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("権限テストプロフィール");

    // Web サイト
    await driver.switchTo().window(originalWindow);
    await driver.get(qaScratchInfo.result.instanceUrl+"/lightning/setup/PermSets/home");
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//span[text()="Online Profile内部ユーザ テスト"]')),15000);
    await el.findElement(By.xpath("../../a")).click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//*[text()="オブジェクト、項目、およびタブの利用可能性などの設定にアクセスする権限"]/div/a')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="マイプロフィール"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="Web サイト"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="Web サイト"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("www.test.com");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "Web サイト 権限付与されていない場合に作成ができます"
    }

    // メッセージ
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="Web サイト"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="メッセージ"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="メッセージ"]')),15000);
    await el.findElement(By.xpath('../../textarea')).sendKeys("メッセージ");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "メッセージ 権限付与されていない場合に作成ができます"
    }
    
    // 会社名
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="メッセージ"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="会社名"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="会社名"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("権限テスト会社名");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "会社名 権限付与されていない場合に作成ができます"
    }

    // 携帯電話
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="会社名"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="携帯電話"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="携帯電話"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("123456789");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "携帯電話 権限付与されていない場合に作成ができます"
    }

    // 市区郡
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="携帯電話"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="市区郡"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="市区郡"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("市区郡");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "市区郡 権限付与されていない場合に作成ができます"
    }

    // 町名・番地
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="市区郡"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="町名・番地"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="町名・番地"]')),15000);
    await el.findElement(By.xpath('../../textarea')).sendKeys("町名・番地");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "町名・番地 権限付与されていない場合に作成ができます"
    }

    // 都道府県
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="町名・番地"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="都道府県"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="都道府県"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("都道府県");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "都道府県 権限付与されていない場合に作成ができます"
    }

    // 部署
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="都道府県"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="部署"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="部署"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("部署");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "部署 権限付与されていない場合に作成ができます"
    }

    // 役職
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="部署"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="役職"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="役職"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("役職");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "役職 権限付与されていない場合に作成ができます"
    }

    // 郵便番号
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="役職"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="郵便番号"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="郵便番号"]')),15000);
    await el.findElement(By.xpath('../../input')).sendKeys("111-1111");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//span[text()="このページのエラーを確認してください。"]')),15000);
    } catch (e) {
      throw "郵便番号 権限付与されていない場合に作成ができます"
    }

    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="郵便番号"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),15000);
    await el.click();

    // コンテンツバージョンID
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="コンテンツバージョンID"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),15000);
    iframe = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),15000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),15000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
    } catch (e) {
      throw "コンテンツバージョンID 権限付与されていない場合に画像登録できます"
    }
    await driver.switchTo().defaultContent();

    // ファイルの種類
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="コンテンツバージョンID"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="ファイルの種類"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),15000);
    iframe = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),15000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),15000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
    } catch (e) {
      throw "ファイルの種類 権限付与されていない場合に画像登録できます"
    }
    await driver.switchTo().defaultContent();

    // 画像URL
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="ファイルの種類"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URL"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),15000);
    iframe = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),15000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),15000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
    } catch (e) {
      throw "画像URL 権限付与されていない場合に画像登録できます"
    }
    await driver.switchTo().defaultContent();

    // 画像URLパラメータ
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URL"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URLパラメータ"]')),15000);
    await el.findElement(By.xpath("../td[2]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().window(otherWindow);
    await driver.sleep(15000);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),15000);
    iframe = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),15000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),15000);
    await driver.findElement(By.id('saveButton')).click();
    await driver.sleep(1000);
    try {
      await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
    } catch (e) {
      throw "画像URLパラメータ 権限付与されていない場合に画像登録できます"
    }
    await driver.switchTo().defaultContent();
    await driver.close();

    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
    await el.click();
    await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
    iframe = await driver.findElement(By.xpath(orgIframe));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URLパラメータ"]')),15000);
    await el.findElement(By.xpath("../td[3]/input")).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
    await el.click();
    await driver.switchTo().defaultContent();
  });
});