require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
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

  it("error", async () => {
    throw "error!"
  });

  // it("permissionset OutboundProfile case", async () => {
  //   let el;
  //   let iframe;
  //   let windows;
  //   let otherWindow;

  //   // 送信プロフィール
  //   await driver.get(qaScratchInfo.result.instanceUrl+"/lightning/n/olPfSohoTest__OnlineProfileHomePage");
  //   const originalWindow = await driver.getWindowHandle();
  //   await driver.wait(until.elementLocated(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe')),15000);
  //   iframe = await driver.findElement(By.xpath('//*[@id="brandBand_2"]/div/div/div/div/force-aloha-page/div/iframe'));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//*[text()="権限テスト会社名"]')),15000);
  //   await el.findElement(By.xpath('following-sibling::div[2]/input[2]')).click();
  //   await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2,15000);
  //   windows = await driver.getAllWindowHandles();
  //   windows.forEach(async handle => {
  //     if (handle !== originalWindow) {
  //       otherWindow = handle;
  //     }
  //   });
  //   await driver.sleep(15000);

  //   // Web サイト
  //   await driver.switchTo().window(originalWindow);
  //   await driver.get(qaScratchInfo.result.instanceUrl+"/lightning/setup/PermSets/home");
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//span[text()="Online Profile内部ユーザ テスト"]')),15000);
  //   await el.findElement(By.xpath("../../a")).click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//*[text()="オブジェクト、項目、およびタブの利用可能性などの設定にアクセスする権限"]/div/a')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="送信プロフィール"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="Web サイト"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "Web サイト 権限付与されていない場合に送信できます"
  //   }

  //   // プロフィール交換URL
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="Web サイト"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="プロフィール交換URL"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "プロフィール交換URL 権限付与されていない場合に送信できます"
  //   }

  //   // マイプロフィール
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="プロフィール交換URL"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="マイプロフィール"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "マイプロフィール 権限付与されていない場合に送信できます"
  //   }

  //   // メッセージ
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="マイプロフィール"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="メッセージ"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "メッセージ 権限付与されていない場合に送信できます"
  //   }

  //   // 画像URL
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="メッセージ"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URL"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "画像URL 権限付与されていない場合に送信できます"
  //   }

  //   // 会社名
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="画像URL"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="会社名"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "会社名 権限付与されていない場合に送信できます"
  //   }

  //   // 携帯電話
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="会社名"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="携帯電話"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "携帯電話 権限付与されていない場合に送信できます"
  //   }

  //   // 市区郡
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="携帯電話"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="市区郡"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "市区郡 権限付与されていない場合に送信できます"
  //   }

  //   // 親送信プロフィール
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="市区郡"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="親送信プロフィール"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "親送信プロフィール 権限付与されていない場合に送信できます"
  //   }

  //   // 町名・番地
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="親送信プロフィール"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="町名・番地"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "町名・番地 権限付与されていない場合に送信できます"
  //   }

  //   // 都道府県
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="町名・番地"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="都道府県"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "都道府県 権限付与されていない場合に送信できます"
  //   }

  //   // 表示回数
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="都道府県"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示回数"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "表示回数 権限付与されていない場合に送信できます"
  //   }

  //   // 表示回数制限
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示回数"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示回数制限"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "表示回数制限 権限付与されていない場合に送信できます"
  //   }

  //   // 表示有効期限
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示回数制限"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示有効期限"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "表示有効期限 権限付与されていない場合に送信できます"
  //   }

  //   // 部署
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="表示有効期限"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="部署"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "表示有効期限 権限付与されていない場合に送信できます"
  //   }

  //   // 役職
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="部署"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="役職"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "役職 権限付与されていない場合に送信できます"
  //   }

  //   // 郵便番号
  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="役職"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="郵便番号"]')),15000);
  //   await el.findElement(By.xpath("../td[2]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.switchTo().window(otherWindow);
  //   await driver.sleep(10000);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="URLを生成する"]')),15000);
  //   await el.click();
  //   await driver.sleep(10000);
  //   try {
  //     await driver.wait(until.elementLocated(By.xpath('//ul[@role="alert"]/li')),15000);
  //   } catch (e) {
  //     throw "郵便番号 権限付与されていない場合に送信できます"
  //   }

  //   await driver.switchTo().window(originalWindow);
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="編集"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//td[text()="郵便番号"]')),15000);
  //   await el.findElement(By.xpath("../td[3]/input")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();

  //   //権限セットを戻る
  //   await driver.get(qaScratchInfo.result.instanceUrl+"/lightning/setup/ManageUsers/home");
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//a[text()="'+qaScratchInfo.result.username+'"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@name="editPermSetAssignments"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//option[@title="Online Profile内部ユーザ テスト"]')),15000);
  //   await el.click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//img[@alt="削除"]')),15000);
  //   await el.findElement(By.xpath("../../a")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@name="editPermSetAssignments"]')),15000);
  //   await el.click();
  //   await driver.wait(until.elementLocated(By.xpath(orgIframe)),15000);
  //   iframe = await driver.findElement(By.xpath(orgIframe));
  //   await driver.switchTo().frame(iframe);
  //   el = await driver.wait(until.elementLocated(By.xpath('//option[@title="Online Profile内部ユーザ"]')),15000);
  //   await el.click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//img[@alt="追加"]')),15000);
  //   await el.findElement(By.xpath("../../a")).click();
  //   el = await driver.wait(until.elementLocated(By.xpath('//input[@value="保存"]')),15000);
  //   await el.click();
  // });
});