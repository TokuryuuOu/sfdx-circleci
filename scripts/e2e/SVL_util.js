require("chromedriver");
const fs = require('fs');
module.exports.takeScreenShot = async function(name,driver){
    let base64 = await driver.takeScreenshot();
    let buffer = Buffer.from(base64, 'base64');
  
    await fs.writeFileSync('screenshots/'+name+'.jpg',buffer)
}


module.exports.scroll = async function(width,height,driver){
    await driver.executeScript("window.scrollTo(" + width + ", " + height + ")");
}