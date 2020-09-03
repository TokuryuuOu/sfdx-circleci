require("chromedriver");

const webdriver =  require("selenium-webdriver");
const { Builder, By, until } = webdriver;
const fs = require('fs');
const qaScratchAdminUser  = JSON.parse(fs.readFileSync("data/smartvisca_admin_user.json","utf-8"));
const qaScratchNormalUser  = JSON.parse(fs.readFileSync("data/smartvisca_normal_user.json","utf-8"));
const chromePrefs = { 'download.default_directory': __dirname + '/download' };
var chrome = require('selenium-webdriver/chrome');

// CI上で実行するときにオプションをつける。モニタリングするときはオプションを外す。
var options = new chrome.Options().addArguments('--headless').addArguments('--disable-gpu').addArguments('--no-sandbox').addArguments('--window-size=1024x768');
var chromeOptions = new chrome.Options().setUserPreferences(chromePrefs);

let driver;

describe("SmartVisca　ページレイアウト　テスト", () => {
  before(() => {
    driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).withCapabilities(options).build();
  });

  after(() => {});

  it("ページレイアウト　名刺レイアウト（管理者用）　テストケース", async () => {
    let url = qaScratchAdminUser.result.instanceUrl
              + "/secur/frontdoor.jsp?sid="
              + qaScratchAdminUser.result.accessToken;
    let un = qaScratchAdminUser.result.username;
    let pw = qaScratchAdminUser.result.password;
    let el;
    let value;

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
    el = await driver.wait(until.elementLocated(By.xpath('//a[@data-tab-value="detailTab"]')),10000);
    await el.click();

    // 連絡先
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="連絡先"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、連絡先 セクション が表示されません"
    }

    // 英文
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="英文"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、英文 セクション が表示されません"
    }

    // メモ
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="メモ"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、メモ セクション が表示されません"
    }

    // イメージ
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="イメージ"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、イメージ セクション が表示されません"
    }

    // 取込先
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="取込先"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、取込先 セクション が表示されません"
    }

    // 名刺の状態
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="名刺の状態"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、名刺の状態 セクション が表示されません"
    }

    // 管理情報
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="管理情報"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、管理情報 セクション が表示されません"
    }

    // 氏名
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="氏名"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、氏名 セクション が表示されません"
    }

    // システム情報
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="システム情報"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、システム情報 セクション が表示されません"
    }

    // Lightning　アクション　リストを開く
    el = await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//lightning-button-menu/button')),10000);
    await el.click();

    // Lightning　アクション　編集
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="編集"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 編集 が表示されません"
    }

    // Lightning　アクション　削除
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="削除"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 削除 が表示されません"
    }

    // Lightning　アクション　コピー
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="コピー"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション コピー が表示されません"
    }

    // Lightning　アクション　所有者の変更
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="所有者の変更"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 所有者の変更 が表示されません"
    }

    // Lightning　アクション　レコードタイプを変更
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="レコードタイプを変更"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション レコードタイプを変更 が表示されません"
    }

    // Lightning　アクション　取引先・取引先責任者に登録*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="取引先・取引先責任者に登録*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 取引先・取引先責任者に登録* が表示されません"
    }

    // Lightning　アクション　転職先を設定*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="転職先を設定*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 転職先を設定* が表示されません"
    }

    // Lightning　アクション　組織情報*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="組織情報*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、Lightningアクション 組織情報* が表示されません"
    }

    // Classic　名刺レイアウトに遷移
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.linkText("Salesforce Classic に切り替え")),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="tsidButton"]/span')),10000);
    value = await el.getText();
    if ("SmartVisca" != value) {
      el = await driver.wait(until.elementLocated(By.xpath('//*[@id="tsidButton"]')),10000);
      await el.click();
      el = await driver.wait(until.elementLocated(By.linkText("SmartVisca")),10000);
      await el.click();
    }
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="名刺"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//div[@class="hotListElement"]//th/a')),10000);
    await el.click();

    // 標準ボタン　編集
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="編集"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　編集 が表示されません"
    }

    // 標準ボタン　削除
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="削除"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　削除 が表示されません"
    }

    // 標準ボタン　コピー
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="コピー"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　コピー が表示されません"
    }

    // 標準ボタン　所有者の変更
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@id="Owner_ileinner"]//a[text()="[変更]"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　所有者の変更 が表示されません"
    }

    // 標準ボタン　印刷用に表示
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="印刷用に表示 (新規ウィンドウ)"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　印刷用に表示 が表示されません"
    }

    // カスタムボタン　取引先・取引先責任者に登録
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="取引先・取引先責任者に登録"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　取引先・取引先責任者に登録 が表示されません"
    }

    // カスタムボタン　転職先を設定
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="転職先を設定"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　カスタムボタン　転職先を設定 が表示されません"
    }

    // カスタムボタン　同じ名刺の検索
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="同じ名刺の検索"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　カスタムボタン　同じ名刺の検索 が表示されません"
    }

    // カスタムボタン　組織情報
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="組織情報"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（管理者用）に、標準ボタン　組織情報 が表示されません"
    }

    // Lightning に戻る
    el = await driver.wait(until.elementLocated(By.linkText("Lightning Experience に切り替え")),10000);
    await el.click();
    await driver.sleep(5000);

    // ログアウト
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.linkText("ログアウト")),10000);
    await el.click();
    await driver.sleep(5000);
  });

  it("ページレイアウト　名刺レイアウト（一般用）　テストケース", async () => {
    let url = qaScratchNormalUser.result.instanceUrl
              + "/secur/frontdoor.jsp?sid="
              + qaScratchNormalUser.result.accessToken;
    let un = qaScratchNormalUser.result.username;
    let pw = qaScratchNormalUser.result.password;
    let el;
    let value;

    // 指定したURLに遷移する
    await driver.get(url);
    // 環境情報を入力
    await driver.wait(until.elementLocated(By.xpath('//*[@id="username"]')),10000);
    await driver.findElement(By.id("username")).sendKeys(un);
    await driver.findElement(By.id("password")).sendKeys(pw);
    await driver.findElement(By.id("Login")).click();

    // 名刺レイアウトに遷移
    await driver.get(qaScratchNormalUser.result.instanceUrl + "/lightning/o/SmartViscaf__NameCard__c/home");
    el = await driver.wait(until.elementLocated(By.xpath('//a[@title="リストビューを選択"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//span[text()="すべて選択"]')),10000);
    await el.findElement(By.xpath('../../a')).click();
    await driver.sleep(5000);
    el = await driver.wait(until.elementLocated(By.xpath('//a[@data-refid="recordId"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//a[@data-tab-value="detailTab"]')),10000);
    await el.click();

    // 連絡先
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="連絡先"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、連絡先 セクション が表示されません"
    }

    // 英文
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="英文"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、英文 セクション が表示されません"
    }

    // メモ
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="メモ"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、メモ セクション が表示されません"
    }

    // イメージ
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="イメージ"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、イメージ セクション が表示されません"
    }

    // 取込先
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="取込先"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、取込先 セクション が表示されません"
    }

    // 名刺の状態
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="名刺の状態"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、名刺の状態 セクション が表示されません"
    }

    // システム情報
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//button//span[text()="システム情報"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、システム情報 セクション が表示されません"
    }

    // Lightning　アクション　リストを開く
    el = await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//lightning-button-menu/button')),10000);
    await el.click();

    // Lightning　アクション　編集
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="編集"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション 編集 が表示されません"
    }

    // // Lightning　アクション　削除
    // try {
    //   await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="削除"]')),10000);
    // } catch (e) {
    //   throw "名刺レイアウト（一般用）に、Lightningアクション 削除 が表示されません"
    // }

    // Lightning　アクション　コピー
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="コピー"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション コピー が表示されません"
    }

    // // Lightning　アクション　所有者の変更
    // try {
    //   await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="所有者の変更"]')),10000);
    // } catch (e) {
    //   throw "名刺レイアウト（一般用）に、Lightningアクション 所有者の変更 が表示されません"
    // }

    // Lightning　アクション　レコードタイプを変更
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer2[@title="レコードタイプを変更"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション レコードタイプを変更 が表示されません"
    }

    // Lightning　アクション　取引先・取引先責任者に登録*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="取引先・取引先責任者に登録*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション 取引先・取引先責任者に登録* が表示されません"
    }

    // Lightning　アクション　転職先を設定*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="転職先を設定*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション 転職先を設定* が表示されません"
    }

    // Lightning　アクション　組織情報*
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@class="windowViewMode-normal oneContent active lafPageHost"]//runtime_platform_actions-actions-ribbon//runtime_platform_actions-action-renderer[@title="組織情報*"]')),10000);
    } catch (e) {
      throw "名刺レイアウト（一般用）に、Lightningアクション 組織情報* が表示されません"
    }

    // Classic　名刺レイアウトに遷移
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.linkText("Salesforce Classic に切り替え")),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//*[@id="tsidButton"]/span')),10000);
    value = await el.getText();
    if ("SmartVisca" != value) {
      el = await driver.wait(until.elementLocated(By.xpath('//*[@id="tsidButton"]')),10000);
      await el.click();
      el = await driver.wait(until.elementLocated(By.linkText("SmartVisca")),10000);
      await el.click();
    }
    el = await driver.wait(until.elementLocated(By.xpath('//a[text()="名刺"]')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.xpath('//div[@class="hotListElement"]//th/a')),10000);
    await el.click();

    // 標準ボタン　編集
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="編集"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　編集 が表示されません"
    }

    // // 標準ボタン　削除
    // try {
    //   await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="削除"]')),10000);  
    // } catch (e) {
    //   throw "名刺レイアウト（一般用）に、標準ボタン　削除 が表示されません"
    // }

    // 標準ボタン　コピー
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="コピー"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　コピー が表示されません"
    }

    // 標準ボタン　所有者の変更
    try {
      await driver.wait(until.elementLocated(By.xpath('//div[@id="Owner_ileinner"]//a[text()="[変更]"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　所有者の変更 が表示されません"
    }

    // 標準ボタン　印刷用に表示
    try {
      await driver.wait(until.elementLocated(By.xpath('//a[@title="印刷用に表示 (新規ウィンドウ)"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　印刷用に表示 が表示されません"
    }

    // カスタムボタン　取引先・取引先責任者に登録
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="取引先・取引先責任者に登録"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　取引先・取引先責任者に登録 が表示されません"
    }

    // カスタムボタン　転職先を設定
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="転職先を設定"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　カスタムボタン　転職先を設定 が表示されません"
    }

    // カスタムボタン　同じ名刺の検索
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="同じ名刺の検索"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　カスタムボタン　同じ名刺の検索 が表示されません"
    }

    // カスタムボタン　組織情報
    try {
      await driver.wait(until.elementLocated(By.xpath('//td[@id="topButtonRow"]//input[@title="組織情報"]')),10000);  
    } catch (e) {
      throw "名刺レイアウト（一般用）に、標準ボタン　組織情報 が表示されません"
    }

    // Lightning に戻る
    el = await driver.wait(until.elementLocated(By.linkText("Lightning Experience に切り替え")),10000);
    await el.click();
    await driver.sleep(5000);

    // ログアウト
    el = await driver.wait(until.elementLocated(By.xpath('/html/body/div[4]/div[1]/section/header/div[2]/span/div[2]/ul/li[9]/span/button')),10000);
    await el.click();
    el = await driver.wait(until.elementLocated(By.linkText("ログアウト")),10000);
    await el.click();
  });
});
