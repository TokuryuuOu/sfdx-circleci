require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
const util = require('./SVL_util')
const fs = require('fs');
const qaScratchAdminUser  = JSON.parse(fs.readFileSync("data/smartvisca_admin_user.json","utf-8"));
// const qaScratchNormalUser  = JSON.parse(fs.readFileSync("data/smartvisca_normal_user.json","utf-8"));
const chromePrefs = { 'download.default_directory': __dirname + '/download' };
var chrome = require('selenium-webdriver/chrome');

// CI上で実行するときにオプションをつける。モニタリングするときはオプションを外す。
var options = new chrome.Options().addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1024x768');
var chromeOptions = new chrome.Options().setUserPreferences(chromePrefs);

let driver;

describe("SmartVisca　関連リスト　テスト", () => {
  before(() => {
    driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).withCapabilities(options).build();
  });

  after(() => {});

  it("関連リスト（名刺）　テストケース", async () => {
    let url = qaScratchAdminUser.result.instanceUrl
              + "/secur/frontdoor.jsp?sid="
              + qaScratchAdminUser.result.accessToken;
    let un = qaScratchAdminUser.result.username;
    let pw = qaScratchAdminUser.result.password;
    let el;

    // 指定したURLに遷移する
    await driver.get(url);
    // 環境情報を入力
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')),10000);
    await driver.findElement(By.id("username")).sendKeys(un);
    await driver.findElement(By.id("password")).sendKeys(pw);
    await driver.findElement(By.id("Login")).click();

    // 名刺レイアウトに遷移
    await driver.get(qaScratchAdminUser.result.instanceUrl + "/lightning/o/SmartViscaf__NameCard__c/home");
    el = await driver.wait(until.elementLocated(By.xpath('//a[@title="リストビューを選択"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//span[text()="すべて選択"]')),10000);
    await el.findElement(By.xpath('../../a')).click();
    await driver.sleep(5000);
    el = await driver.wait(until.elementLocated(By.xpath('//a[@data-refid="recordId"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//a[@data-tab-value="relatedListsTab"]')),10000);
    await el.click();

    // 関連リスト　古い名刺
    try {
      await driver.wait(until.elementLocated(By.xpath('//flexipage-tab2[@aria-labelledby="relatedListsTab__item"]//div[@data-aura-class="forceRelatedListCardHeader"]//span[@title="古い名刺"]')),10000);
    } catch (e) {
      throw "関連リストに、古い名刺 が表示されません"
    }

    // 関連リスト　名刺 (転職前の名刺)
    try {
      await driver.wait(until.elementLocated(By.xpath('//flexipage-tab2[@aria-labelledby="relatedListsTab__item"]//div[@data-aura-class="forceRelatedListCardHeader"]//span[@title="名刺 (転職前の名刺)"]')),10000);
    } catch (e) {
      throw "関連リストに、名刺 (転職前の名刺) が表示されません"
    }

    // 関連リスト　取引先
    try {
      await driver.wait(until.elementLocated(By.xpath('//flexipage-tab2[@aria-labelledby="relatedListsTab__item"]//div[@data-aura-class="forceRelatedListCardHeader"]//span[@title="取引先"]')),10000);
    } catch (e) {
      throw "関連リストに、取引先 が表示されません"
    }

    // 関連リスト　取引先責任者
    try {
      await driver.wait(until.elementLocated(By.xpath('//flexipage-tab2[@aria-labelledby="relatedListsTab__item"]//div[@data-aura-class="forceRelatedListCardHeader"]//span[@title="取引先責任者"]')),10000);
    } catch (e) {
      throw "関連リストに、取引先責任者 が表示されません"
    }

    // 関連リスト　メモ & 添付ファイル
    try {
      await driver.wait(until.elementLocated(By.xpath('//flexipage-tab2[@aria-labelledby="relatedListsTab__item"]//div[@data-aura-class="forceRelatedListCardHeader"]//span[@title="メモ & 添付ファイル"]')),10000);
    } catch (e) {
      throw "関連リストに、メモ & 添付ファイル が表示されません"
    }

    // 活動履歴
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@id="activityTab__item"]')),10000);
    } catch (e) {
      throw "活動履歴 が表示されません"
    }

    await driver.sleep(5000);
    await util.takeScreenShot("関連リスト（名刺）　テストケース",driver);
    await driver.sleep(5000);

    // ログアウト
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.linkText("ログアウト")),10000);
    await el.click();
    await driver.sleep(5000);
  });
});
