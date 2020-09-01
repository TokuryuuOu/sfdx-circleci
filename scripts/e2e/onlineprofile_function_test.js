require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, Key, until } = webdriver;
const path = require('path');
const imgUploadIframe = "/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___flexipage__default_rec_l___olPfSohoTest__myprofile__c___view/forcegenerated-flexipage_default_rec_l_olPfSohoTest__myprofile__c__view_js/record_flexipage-record-page-decorator/div/slot/flexipage-record-home-template-desktop2/div/div[2]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[2]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_olPfSohoTest__myprofile__c___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[4]/div/div/div/slot/force-record-layout-row/slot/force-record-layout-item/div/div/div/span/slot[2]/force-aloha-page/div/iframe"
const fs = require('fs');
const qaScratchInfo  = JSON.parse(fs.readFileSync("data/qa_scratch_info.json","utf-8"));
const npw = JSON.parse(fs.readFileSync("data/qa_scratch_pw.json","utf-8"));
const assert = require("assert");
const chromePrefs = { 'download.default_directory': __dirname + '/download' };
var chrome = require('selenium-webdriver/chrome');

// CI上で実行するときにオプションをつける。モニタリングするときはオプションを外す。
var options = new chrome.Options().addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1024x768');
var chromeOptions = new chrome.Options().setUserPreferences(chromePrefs);

let driver;

describe("SeleniumChromeTest", () => {
  before(() => {
    driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).withCapabilities(options).build();
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
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')),10000);
    await driver.findElement(By.id("username")).sendKeys(un);
    await driver.findElement(By.id("password")).sendKeys(npw.newPassword);
    await driver.findElement(By.id("Login")).click();
  });

  it("LEX app tab case", async () => {
    let url = qaScratchInfo.result.loginUrl
              + "/secur/frontdoor.jsp?sid="
              + qaScratchInfo.result.accessToken;
    await driver.get(url);
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')),10000);
    await driver.findElement(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')),10000);
    await driver.findElement(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')).sendKeys("OnlineProfile",Key.ENTER);
    let cUrl = await driver.getCurrentUrl();
    let cUrlst = (cUrl + '').split('/');
    assert.equal("lightning/n/olPfSohoTest__OnlineProfileHomePage",cUrlst[3]+'/'+cUrlst[4]+'/'+cUrlst[5],"OnlineProfileAppが選択できません");
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="スタートページ"]')),10000);
    } catch (e) {
      throw "タグ：スタートページ　が表示していません"
    }
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="送信プロフィール"]')),10000);
    } catch (e) {
      throw "タグ：送信プロフィール　が表示していません"
    }
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="受信プロフィール"]')),10000);
    } catch (e) {
      throw "タグ：受信プロフィール　が表示していません"
    }
    let errorname;
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="マイプロフィール"]')),10000);
    } catch (e) {
        errorname = e.name;
    }
    if ("TimeoutError" != errorname) {
      throw "タグ：マイプロフィール　が表示しています"
    }
  });

  it("CLASSIC app tab case", async () => {
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await driver.findElement(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')).click();
    await driver.wait(until.elementLocated(By.linkText("Salesforce Classic に切り替え")),10000);
    await driver.findElement(By.linkText("Salesforce Classic に切り替え")).click();
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath('//*[@id="tsidButton"]')),10000);
    await driver.findElement(By.xpath('//*[@id="tsidButton"]')).click();
    await driver.wait(until.elementLocated(By.linkText("OnlineProfile")),10000);
    await driver.findElement(By.linkText("OnlineProfile")).click();
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="スタートページタブ - 選択済み"]')),10000);
    } catch (e) {
      throw "タグ：スタートページ　が表示していません"
    } 
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="送信プロフィールタブ"]')),10000);
    } catch (e) {
      throw "タグ：送信プロフィール　が表示していません"
    }
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="受信プロフィールタブ"]')),10000);
    } catch (e) {
      throw "タグ：受信プロフィール　が表示していません"
    }
    let errorname;
    try {
        await driver.wait(until.elementLocated(By.xpath('//a[@title="マイプロフィールタブ"]')),10000);
    } catch (e) {
        errorname = e.name;
    }
    if ("TimeoutError" != errorname) {
        throw "タグ：マイプロフィール　が表示しています"
    }
    await driver.findElement(By.xpath('//*[@id="tsidButton"]')).click();
    await driver.wait(until.elementLocated(By.linkText("セールス")),10000);
    await driver.findElement(By.linkText("セールス")).click();
    await driver.wait(until.elementLocated(By.linkText("Lightning Experience に切り替え")),10000);
    await driver.findElement(By.linkText("Lightning Experience に切り替え")).click();
  });

  it("startpage case", async () => {
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')),10000);
    await driver.findElement(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')),10000);
    await driver.findElement(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')).sendKeys("OnlineProfile",Key.ENTER);
    // レコードがない
    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),10000);
    await driver.sleep(10000)
    let iframe1 = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
    await driver.switchTo().frame(iframe1);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div/form/h3')),10000);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/form/h4')),10000);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/form/div[1]')),10000);
    await driver.wait(until.elementLocated(By.xpath('//input[@value="マイプロフィールを登録"]')),10000);
    await driver.findElement(By.xpath('//input[@value="マイプロフィールを登録"]')).click();
    await driver.switchTo().defaultContent();
    // レコードがある
    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),10000);
    await driver.sleep(10000)
    let iframe2 = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
    await driver.switchTo().frame(iframe2);
    let el = await driver.wait(until.elementLocated(By.xpath('/html/body/div/form/h3')),10000);
    await driver.wait(until.elementIsVisible(el), 10000);
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/form/h4')),10000);
    await driver.wait(until.elementIsVisible(el), 10000);
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/form/div[2]')),10000);
    await driver.wait(until.elementIsVisible(el), 10000);
    await driver.wait(until.elementLocated(By.xpath('//input[@value="プロフィールを編集"]')),10000);
    await driver.findElement(By.xpath('//input[@value="プロフィールを編集"]')).click();
    await driver.switchTo().defaultContent();
    let cUrl = await driver.getCurrentUrl();
    let cUrlst = (cUrl + '').split('/');
    assert.equal("lightning/r/olPfSohoTest__MyProfile__c/view",cUrlst[3]+'/'+cUrlst[4]+'/'+cUrlst[5]+'/'+cUrlst[7],"プロフィールを編集ボタンを押すと、マイプロフィールレコードの編集画面へ遷移していません");
    // マイプロフィール情報確認
    const orgJson = JSON.parse(fs.readFileSync('data/organization.json', 'utf8'));
    const userJson = JSON.parse(fs.readFileSync('config/project-user-admin-def.json', 'utf8'));
    await driver.wait(until.elementLocated(By.xpath('//button[@title="姓 の編集"]')),10000);
    await driver.findElement(By.xpath('//button[@title="姓 の編集"]')).click();
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__LastName__c"]')),10000);
    let ln = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__Email__c"]')),10000);
    let em = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__MobilePhone__c"]')),10000);
    let mp = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__Tel1__c"]')),10000);
    let tp1 = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__Department__c"]')),10000);
    let dp = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__Title__c"]')),10000);
    let tt = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__Tel__c"]')),10000);
    let tp = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__PostalCode__c"]')),10000);
    let pc = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__State__c"]')),10000);
    let st = await el.getAttribute("value");
    el = await driver.wait(until.elementLocated(By.xpath('//input[@name="olPfSohoTest__City__c"]')),10000);
    let ct = await el.getAttribute("value");
    assert.equal(
      true,
      (userJson.LastName != ln
        || userJson.Email != em
        || null != mp
        || null != tp1
        || null != dp
        || null != tt
      ), 
      "登録したマイプロフィールレコードのユーザー情報が間違っています"
    );
    assert.equal(
      true,
      (orgJson.records[0].Phone == tp
        && orgJson.records[0].PostalCode == pc
        && orgJson.records[0].State == st
        && orgJson.records[0].City == ct
      ),
      "登録したマイプロフィールレコードの組織情報が間違っています"
    );
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[text()="'+orgJson.records[0].Street+'"]')),10000);
    } catch (e) {
      throw "登録したマイプロフィールレコードの組織情報が間違っています"
    }
    await driver.navigate().back();
    const originalWindow = await driver.getWindowHandle();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),10000);
    await driver.sleep(10000)
    let iframe3 = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
    await driver.switchTo().frame(iframe3);
    await driver.wait(until.elementLocated(By.xpath('//input[@value="このプロフィールを送る"]')),10000);
    await driver.findElement(By.xpath('//input[@value="このプロフィールを送る"]')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    let windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
        cUrl = await driver.getCurrentUrl();
        cUrlst = (cUrl + '').split(/[/?&]/);
      }
    });
    await driver.sleep(10000)
    assert.equal("apex/UrlGenerator",cUrlst[3]+'/'+cUrlst[4],"このプロフィールを送るボタンを押すと、URL生成画面へ遷移していません");
    await driver.wait(until.elementLocated(By.xpath('//input[@value="閉じる"]')),10000);
    await driver.findElement(By.xpath('//input[@value="閉じる"]')).click();
    await driver.switchTo().window(originalWindow);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),10000);
    await driver.sleep(10000)
    let iframe4 = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
    await driver.switchTo().frame(iframe4);
    await driver.wait(until.elementLocated(By.xpath('//input[@value="マイプロフィールを登録"]')),10000);
    await driver.findElement(By.xpath('//input[@value="マイプロフィールを登録"]')).click();
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/form/div[4]')),10000);
    await driver.wait(until.elementIsVisible(el), 10000);
  });

  it("create myprofile case", async () => {
    let url = qaScratchInfo.result.instanceUrl
              + "/lightning/o/olPfSohoTest__MyProfile__c/home";
    let el;
    let value;
    let rq;
    await driver.sleep(10000);
    await driver.get(url);

    // 作成
    await driver.wait(until.elementLocated(By.xpath('//a[@title="新規"]')),10000);
    await driver.findElement(By.xpath('//a[@title="新規"]')).click();

    // プロフィール名
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="プロフィール名"]')),10000);
    assert.notEqual(null,el,"情報セクション　プロフィール名　存在しません");
    rq = await el.findElement(By.xpath('../span[@class="required "]'));
    assert.notEqual(null,rq,"情報セクション　プロフィール名　必須項目ではありません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("プロフィール");
    value = await el.getAttribute("value");
    assert.equal("プロフィール",value,"情報セクション　プロフィール名　入力ができません");

    // メインプロフィール
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="メインプロフィール"]')),10000);
    assert.notEqual(null,el,"情報セクション　メインプロフィール　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    value = await el.getAttribute("defaultchecked");
    assert.equal("true",value,"情報セクション　メインプロフィール　初期値はTRUEではありません");
    await el.click();
    value = await el.getAttribute("checked");
    assert.equal(null,value,"情報セクション　メインプロフィール　切り替え出来ません");

    // 所有者
    el = await driver.wait(until.elementLocated(By.xpath('//div//span[text()="所有者"]')),10000);
    el = await el.findElement(By.xpath('../../div[2]/span/span'));
    value = await el.getText();
    assert.notEqual(null,value,"情報セクション　所有者　指定していません");

    // 姓
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="姓"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　姓　存在しません");
    rq = await el.findElement(By.xpath('../span[@class="required "]'));
    assert.notEqual(null,rq,"プロフィールセクション　姓　必須項目ではありません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("姓");
    value = await el.getAttribute("value");
    assert.equal("姓",value,"プロフィールセクション　姓　入力ができません");

    // 名
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="名"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　名　存在しません");
    rq = await el.findElement(By.xpath('../span[@class="required "]'));
    assert.notEqual(null,rq,"プロフィールセクション　名　必須項目ではありません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("名");
    value = await el.getAttribute("value");
    assert.equal("名",value,"プロフィールセクション　名　入力ができません");

    // メール
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="メール"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　メール　存在しません");
    rq = await el.findElement(By.xpath('../span[@class="required "]'));
    assert.notEqual(null,rq,"プロフィールセクション　メール　必須項目ではありません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("test@test.com");
    value = await el.getAttribute("value");
    assert.equal("test@test.com",value,"プロフィールセクション　メール　入力ができません");

    // 携帯電話
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="携帯電話"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　携帯電話　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("123456789");
    value = await el.getAttribute("value");
    assert.equal("123456789",value,"プロフィールセクション　携帯電話　入力ができません");

    // 電話番号
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="電話番号"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　電話番号　存在しません");
    let icon1 = await el.findElement(By.xpath('../div/span'));
    value = await icon1.getText();
    assert.equal("直通番号や内線番号を入力します",value,"プロフィールセクション　電話番号　ヘルプテキストが表示されません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("123456789");
    value = await el.getAttribute("value");
    assert.equal("123456789",value,"プロフィールセクション　電話番号　入力ができません");

    // 電話番号2
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="電話番号2"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　電話番号2　存在しません");
    let icon2 = await el.findElement(By.xpath('../div/span'));
    value = await icon2.getText();
    assert.equal("直通番号や内線番号を入力します",value,"プロフィールセクション　電話番号　ヘルプテキストが表示されません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("123456789");
    value = await el.getAttribute("value");
    assert.equal("123456789",value,"プロフィールセクション　電話番号2　入力ができません");

    // 部署
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="部署"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　部署　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("部署");
    value = await el.getAttribute("value");
    assert.equal("部署",value,"プロフィールセクション　部署　入力ができません");

    // 役職
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="役職"]')),10000);
    assert.notEqual(null,el,"プロフィールセクション　役職　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("役職");
    value = await el.getAttribute("value");
    assert.equal("役職",value,"プロフィールセクション　役職　入力ができません");

    // 会社名
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="会社名"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　会社名　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("会社名");
    value = await el.getAttribute("value");
    assert.equal("会社名",value,"勤務先セクション　会社名　入力ができません");

    // 代表電話番号
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="代表電話番号"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　代表電話番号　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("123456789");
    value = await el.getAttribute("value");
    assert.equal("123456789",value,"勤務先セクション　代表電話番号　入力ができません");

    // Web サイト
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="Web サイト"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　Web サイト　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("www.test.com");
    value = await el.getAttribute("value");
    assert.equal("www.test.com",value,"勤務先セクション　Web サイト　入力ができません");

    // 郵便番号
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="郵便番号"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　郵便番号　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("111-1111");
    value = await el.getAttribute("value");
    assert.equal("111-1111",value,"勤務先セクション　郵便番号　入力ができません");

    // 都道府県
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="都道府県"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　都道府県　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("都道府県");
    value = await el.getAttribute("value");
    assert.equal("都道府県",value,"勤務先セクション　都道府県　入力ができません");

    // 市区郡
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="市区郡"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　市区郡　存在しません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("市区郡");
    value = await el.getAttribute("value");
    assert.equal("市区郡",value,"勤務先セクション　市区郡　入力ができません");

    // 町名・番地
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="町名・番地"]')),10000);
    assert.notEqual(null,el,"勤務先セクション　町名・番地　存在しません");
    el = await el.findElement(By.xpath('../../textarea'));
    await el.sendKeys("町名・番地");
    value = await el.getAttribute("value");
    assert.equal("町名・番地",value,"勤務先セクション　町名・番地　入力ができません");

    // メッセージ
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="メッセージ"]')),10000);
    assert.notEqual(null,el,"メッセージセクション　メッセージ　存在しません");
    el = await el.findElement(By.xpath('../../textarea'));
    await el.sendKeys("メッセージ");
    value = await el.getAttribute("value");
    assert.equal("メッセージ",value,"メッセージセクション　メッセージ　入力ができません");

    // 保存
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),10000);
    await el.click();
    let cUrl = await driver.getCurrentUrl();
    let cUrlst = (cUrl + '').split('/');
    assert("lightning/r/olPfSohoTest__MyProfile__c/view",cUrlst[3]+'/'+cUrlst[4]+'/'+cUrlst[5]+'/'+cUrlst[7],"保存して、レコードが作成されません");

    // 編集
    el = await driver.wait(until.elementLocated(By.xpath('//button[@name="Edit"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//label//span[text()="プロフィール名"]')),10000);
    assert.notEqual(null,el,"既存レコードが編集できません");
    el = await el.findElement(By.xpath('../../input'));
    await el.sendKeys("編集後");
    el = await driver.wait(until.elementLocated(By.xpath('//button[@title="保存"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[text()="プロフィール編集後"]')),10000);
    assert.notEqual(null,el,"既存レコードが編集して、正常に保存できません");

    // 画像登録
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.xpath(imgUploadIframe)),10000);
    let iframe1 = await driver.findElement(By.xpath(imgUploadIframe));
    await driver.switchTo().frame(iframe1);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page:j_id5"]')),10000);
    await driver.findElement(By.id("j_id0:page:j_id5")).sendKeys(path.join(process.cwd(),"data/myProfileImg.png"))
    await driver.sleep(10000)
    await driver.wait(until.elementLocated(By.id('saveButton')),10000);
    await driver.findElement(By.id('saveButton')).click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:page"]/div[1]/div[3]/a/img')),10000);
    value = await el.getAttribute("src");
    assert.notEqual(null,value,"正常に画像登録できません")
    await driver.switchTo().defaultContent();
  });

  it("create url case", async () => {
    let url = qaScratchInfo.result.instanceUrl
              + "/lightning/o/olPfSohoTest__OutboundProfile__c/home";
    let el;
    let value;
    let td;
    await driver.sleep(10000);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')),10000);
    await driver.findElement(By.xpath('/html/body/div[4]/div[1]/section/div[1]/div[1]/one-appnav/div/div/div/div/one-app-launcher-header/button')).click();
    await driver.wait(until.elementLocated(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')),10000);
    await driver.findElement(By.xpath('//*[@placeholder="アプリケーションおよび項目を検索..."]')).sendKeys("OnlineProfile",Key.ENTER);
    const originalWindow = await driver.getWindowHandle();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),10000);
    await driver.sleep(10000)
    let iframe = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//*[text()="会社名"]')),10000);
    await el.findElement(By.xpath('following-sibling::div[2]/input[2]')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    let windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.sleep(10000)

    // プロフィール情報
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:urlGeneratorPage"]/div[2]/table')),10000);
    td = await el.findElement(By.xpath('tbody/tr[2]/td[2]/div'));
    value = await td.getText();
    assert.equal("姓 名",value,"実行ユーザのプロフィールが表示されません");
    try {
      await el.findElement(By.xpath('tbody/tr[3]'));
    } catch (e) {
      value = e.name;
    }
    assert.equal("NoSuchElementError",value,"実行ユーザのプロフィールが1件以上表示されます");

    // URL生成ボタン
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:exProfUrl"]')),10000);
    value = await el.getText();
    assert.notEqual(null,value,"URL生成ボタンを押下し、遷移ができません");

    // 閉じるボタン
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="閉じる"]')),10000);
    await el.click();

    // メンバー追加ボタン
    await driver.switchTo().window(originalWindow);
    await driver.switchTo().frame(iframe);
    el = await driver.wait(until.elementLocated(By.xpath('//*[text()="会社名"]')),10000);
    await el.findElement(By.xpath('following-sibling::div[2]/input[2]')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.sleep(10000)
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="メンバーを追加する"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:addMemberPage"]')),10000);
    assert.notEqual(null,value,"メンバー追加画面へ遷移できません");
    await el.findElement(By.xpath('div/div[1]/input')).click();
    await el.findElement(By.xpath('div/div[2]/input[1]')).sendKeys("mail01@mai.l.com");
    await el.findElement(By.xpath('div/div[2]/input[2]')).click();
    await driver.sleep(5000)
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:addMemberPage"]')),10000);
    td = await el.findElement(By.xpath('div[3]/table/tbody/tr[2]/td[4]/div'));
    value = await td.getText();
    assert.equal("mail01@mai.l.com",value,"他ユーザのプロフィールが検索できません");
    await el.findElement(By.xpath('div[3]/table/tbody/tr[1]/th[1]/input')).click();
    await el.findElement(By.xpath('//input[@value="選択中のメンバーを追加する"]')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.sleep(10000)
    
    // メンバー再追加
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="メンバーを追加する"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:addMemberPage"]')),10000);
    await el.findElement(By.xpath('div/div[2]/input[1]')).clear();
    await el.findElement(By.xpath('div/div[2]/input[1]')).sendKeys("mail02@mai.l.com");
    await el.findElement(By.xpath('div/div[2]/input[2]')).click();
    await driver.sleep(5000)
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:addMemberPage"]')),10000);
    td = await el.findElement(By.xpath('div[3]/table/tbody/tr[2]/td[4]/div'));
    value = await td.getText();
    await el.findElement(By.xpath('div[3]/table/tbody/tr[1]/th[1]/input')).click();
    await el.findElement(By.xpath('//input[@value="選択中のメンバーを追加する"]')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.sleep(10000)
    td = await driver.wait(until.elementLocated(By.xpath('//*[text()="mail02@mai.l.com"]')),10000);
    assert.notEqual(null,td,"検索したプロフィールを追加できません");

    // メンバーの削除
    await td.findElement(By.xpath('../../td[1]/div/input')).click();
    await driver.sleep(1000)
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[text()="mail02@mai.l.com"]')),10000);
    } catch (e) {
      value = e.name;
    }
    assert.equal("TimeoutError",value,"追加したメンバーの削除できません");

    // 有効期間の表示
    el = await driver.wait(until.elementLocated(By.xpath('//*[text()="URLの有効期間:"]')),10000);
    td = await el.findElement(By.xpath('../td[2]/input'));
    value = await td.getAttribute("value");
    assert.notEqual(null,value,"有効期限が表示されません");

    // URL生成
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="j_id0:j_id1:j_id2:page:exProfUrl"]')),10000);
    mpUrl = await el.getText();
    assert.notEqual(null,mpUrl,"URL生成できません");

    // URLをコピーボタン
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLをコピー"]')),10000);
    await el.click();

    // 閉じるボタン
    el = await driver.wait(until.elementLocated(By.xpath('//input[@value="閉じる"]')),10000);
    await el.click();

    // レコード作成
    await driver.switchTo().window(originalWindow);
    await driver.get(url);
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[text()="'+mpUrl+'"]')),10000);
    } catch (e) {
      throw "URL生成ボタンを押下し、レコードが作成されません"
    }
  });

  it("profile case", async () => {
    let el;
    let value;
    await driver.sleep(10000)
    const originalWindow = await driver.getWindowHandle();
    // プロフィール画面への遷移
    await driver.get(mpUrl)
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[@action="/profile/olPfSohoTest__ProfileExchanger"]')),10000);
    } catch (e) {
      throw "プロフィール一覧画面へ遷移し、正しく表示されません"
    }
    
    // プロフィール情報
    try {
      el = await driver.wait(until.elementLocated(By.xpath('//*[text()="会社名"]')),10000);
    } catch (e) {
      throw "確認したいプロフィールは表示されません"
    }
    let head = await el.findElement(By.xpath('following-sibling::div[1]/div/div/div[@class="uk-card-header"]'));
    let body = await el.findElement(By.xpath('following-sibling::div[1]/div/div/div[@class="uk-card-body"]'));
    let foot = await el.findElement(By.xpath('following-sibling::div[1]/div/div/div[@class="uk-card-footer"]'));
    
    // 姓
    el = await head.findElement(By.xpath('div/div[1]'));
    value = await el.getText();
    assert.notEqual(-1,value.search("姓"),"プロフィールの姓は正しく表示されません");

    // 名
    assert.notEqual(-1,value.search("名"),"プロフィールの名は正しく表示されません");

    // 部署
    el = await head.findElement(By.xpath('div/div[2]'));
    value = await el.getText();
    assert.notEqual(-1,value.search("部署"),"プロフィールの部署は正しく表示されません");

    // 役職
    assert.notEqual(-1,value.search("役職"),"プロフィールの役職は正しく表示されません");

    // 画像
    try {
      await head.findElement(By.xpath('div/div/div[@class="uk-float-right profile-card-image"]'));
    } catch (e) {
      throw "プロフィールの画像は表示されません"
    }

    // メッセージ
    el = await body.findElement(By.xpath('blockquote/p'));
    value = await el.getText();
    assert.notEqual(-1,value.search("メッセージ"),"プロフィールのメッセージは正しく表示されません");

    // 携帯電話
    el = await body.findElement(By.xpath('div[@class="phone"]/a'));
    value = await el.getText();
    assert.notEqual(-1,value.search("123456789"),"プロフィールの携帯電話は正しく表示されません");

    // Web サイト
    el = await body.findElement(By.xpath('div[@class="other"]/a'));
    value = await el.getText();
    assert.notEqual(-1,value.search("www.test.com"),"プロフィールのWebサイトは正しく表示されません");

    // 郵便番号
    el = await body.findElement(By.xpath('div[@class="postal"]'));
    value = await el.getText();
    assert.notEqual(-1,value.search("111-1111"),"プロフィールの郵便番号は正しく表示されません");

    // 都道府県
    el = await body.findElement(By.xpath('div[@class="address"]'));
    value = await el.getText();
    assert.notEqual(-1,value.search("都道府県"),"プロフィールの都道府県は正しく表示されません");

    // 市区郡
    assert.notEqual(-1,value.search("市区郡"),"プロフィールの市区郡は正しく表示されません");

    // 町名・番地
    assert.notEqual(-1,value.search("町名・番地"),"プロフィールの町名・番地は正しく表示されません");

    // 複数のプロフィール表示
    try {
      await driver.wait(until.elementLocated(By.xpath('//*[text()="会社No,1"]')),10000);
    } catch (e) {
      throw "もうひとつのプロフィールは表示されません"
    }

    // コピー (vCardダウンロード) 
    el = await foot.findElement(By.xpath('button[1]'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', el);
    await el.click();
    el = await foot.findElement(By.xpath('button[2]'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', el);
    await el.click();
    await driver.sleep(5000)
    await driver.get("file://"+path.dirname(fs.realpathSync('data/textarea.html'))+"/textarea.html")
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/textarea')),10000);
    await el.sendKeys(Key.SHIFT, Key.INSERT);
    value = await el.getAttribute("value");
    await driver.navigate().back();
    assert.notEqual(-1,value.search("会社名"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("姓"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("名"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("部署"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("役職"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("メッセージ"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("123456789"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("test@test.com"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("111-1111"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("都道府県"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("市区郡"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("町名・番地"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("www.test.com"),"プロフィール情報が正しくコピーされません");

    // 全てコピー
    el = await driver.wait(until.elementLocated(By.xpath('//div[@class="uk-box-shadow-hover-small"]/button')),10000);
    await el.click();
    await driver.get("file://"+path.dirname(fs.realpathSync('data/textarea.html'))+"/textarea.html")
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/textarea')),10000);
    await el.sendKeys(Key.SHIFT, Key.INSERT);
    value = await el.getAttribute("value");
    await driver.navigate().back();
    // プロファイル１
    assert.notEqual(-1,value.search("会社名"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("姓"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("名"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("部署"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("役職"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("メッセージ"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("123456789"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("test@test.com"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("111-1111"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("都道府県"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("市区郡"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("町名・番地"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("www.test.com"),"プロフィール情報が正しくコピーされません");
    // プロファイル２
    assert.notEqual(-1,value.search("会社No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("姓No.1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("名No.1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("部署No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("役職No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("メッセージ１"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("090-0001-1111"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("03-001-0001"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("03-002-0001"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("mail01@mai.l.com"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("111-0001"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("都道府県No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("市区郡No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("町名・番地No,1"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("03-003-0001"),"プロフィール情報が正しくコピーされません");
    assert.notEqual(-1,value.search("www.test1.com"),"プロフィール情報が正しくコピーされません");

    // csvダウンロード
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: cloud-download"]//parent::button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="Excel等"]')),10000);
    await el.click();
    await driver.sleep(5000)
    value = fs.readdirSync(__dirname + '/download').join(',');
    assert.notEqual(-1,value.search("csv"),"CSV形式でダウンロードができません");
    assert.notEqual(-1,value.search("vcf"),"vCard形式でダウンロードができる");

    // sunbridge　logo
    el = await driver.wait(until.elementLocated(By.xpath('//a[@href="https://www.sunbridge.com/"]')),10000);
    await el.click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,10000);
    let windows = await driver.getAllWindowHandles();
    let cUrl;
    let cUrlst;
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
        cUrl = await driver.getCurrentUrl();
      }
    });
    await driver.sleep(10000)
    assert.equal("https://www.sunbridge.com/",cUrl,"https://www.sunbridge.com へ遷移できません");
    await driver.close();
    await driver.switchTo().window(originalWindow);

    // プロフィールを送り出す
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: pencil"]//parent::button')),10000);
    await el.click();
    cUrl = await driver.getCurrentUrl();
    cUrlst = (cUrl + '').split('/');
    assert.equal("profile/olPfSohoTest__ProfileExchanger",cUrlst[3]+"/"+cUrlst[4],"受信者のプロフィール入力画面へ遷移できません")
  });

  it("profile edit case", async () => {
    let url = qaScratchInfo.result.instanceUrl
              + "/lightning/o/olPfSohoTest__InboundProfile__c/home";
    let el;
    let value;
    let cUrl;
    let cUrlst;

    // プロフィール一覧に戻る
    await driver.sleep(10000)
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: arrow-left"]/parent::button')),10000);
    await el.click();
    cUrl = await driver.getCurrentUrl();
    cUrlst = (cUrl + '').split('/');
    assert.equal("profile/olpfsohotest__profileexchangerreply",cUrlst[3]+"/"+cUrlst[4],"プロフィール一覧画面へ遷移できません")
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: pencil"]/parent::button')),10000);
    await el.click();

    // 姓
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:lastName")),10000);
    await el.sendKeys("姓");
    value = await el.getAttribute("value");
    assert.equal("姓",value,"姓を入力ができません");
    value = await el.getAttribute("required");
    assert.equal("true",value,"姓は必須項目になっていません");
    value = await el.getAttribute("maxlength");
    assert.equal("80",value,"姓の入力できる文字数は80ではありません");

    // 名
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:firstname")),10000);
    await el.sendKeys("名");
    value = await el.getAttribute("value");
    assert.equal("名",value,"名を入力ができません");
    value = await el.getAttribute("required");
    assert.equal("true",value,"名は必須項目になっていません");
    value = await el.getAttribute("maxlength");
    assert.equal("40",value,"名の入力できる文字数は40ではありません");

    // 会社名
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:j_id14")),10000);
    await el.sendKeys("会社名");
    value = await el.getAttribute("value");
    assert.equal("会社名",value,"会社名を入力ができません");
    value = await el.getAttribute("maxlength");
    assert.equal("80",value,"会社名の入力できる文字数は80ではありません");

    // メールアドレス
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:email")),10000);
    await el.sendKeys("test@example.com");
    value = await el.getAttribute("value");
    assert.equal("test@example.com",value,"メールアドレスを入力ができません");
    value = await el.getAttribute("required");
    assert.equal("true",value,"メールアドレスは必須項目になっていません");
    value = await el.getAttribute("maxlength");
    assert.equal("80",value,"メールアドレスの入力できる文字数は80ではありません");
    value = await el.getAttribute("type");
    assert.equal("email",value,"入力形式はメール形式ではありません");

    // 携帯電話
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:j_id20")),10000);
    await el.sendKeys("123456789");
    value = await el.getAttribute("value");
    assert.equal("123456789",value,"携帯電話を入力ができません");
    value = await el.getAttribute("maxlength");
    assert.equal("40",value,"携帯電話の入力できる文字数は40ではありません");

    // 部署
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:j_id16")),10000);
    await el.sendKeys("部署");
    value = await el.getAttribute("value");
    assert.equal("部署",value,"部署を入力ができません");
    value = await el.getAttribute("maxlength");
    assert.equal("80",value,"部署の入力できる文字数は40ではありません");

    // 役職
    el = await driver.wait(until.elementLocated(By.id("j_id0:j_id7:j_id18")),10000);
    await el.sendKeys("役職");
    value = await el.getAttribute("value");
    assert.equal("役職",value,"役職を入力ができません");
    value = await el.getAttribute("maxlength");
    assert.equal("80",value,"役職の入力できる文字数は40ではありません");

    // プロフィールを送信
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: arrow-right"]/parent::button')),10000);
    await el.click();
    cUrl = await driver.getCurrentUrl();
    cUrlst = (cUrl + '').split('/');
    assert.equal("profile/olpfsohotest__profileexchangerreply",cUrlst[3]+"/"+cUrlst[4],"プロフィールが送信完了画面へ遷移できません")

    // 受け取ったプロフィール一覧に戻る
    el = await driver.wait(until.elementLocated(By.xpath('//span[@uk-icon="icon: chevron-double-left;"]')),10000);
    await el.findElement(By.xpath('../../../a')).click();
    cUrl = await driver.getCurrentUrl();
    cUrlst = (cUrl + '').split('/');
    assert.equal("profile/olpfsohotest__profileexchangermessage",cUrlst[3]+"/"+cUrlst[4],"受け取ったプロフィール一覧に戻れません");

    // レコードが作成
    await driver.get(url);
    el = await driver.wait(until.elementLocated(By.xpath('//a[@title="リストビューを選択"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//span[text()="すべて選択"]')),10000);
    await el.findElement(By.xpath('../../a')).click();
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="OnlineProfile"]')),10000);
    } catch (e) {
      throw "受信プロファイルにレコードが作成されません"
    }
  });
});
