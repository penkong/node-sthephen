
// puppeteer for headless browser testing with chromiunm 
// pupet => browser => tab(page);
const puppeteer = require('puppeteer');

let browser, page;
beforeEach( async () => {
  // browser obj page obj
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});



//puppeteer make text send to chromioum it turn obj
test('should we can launch browser', async () => {
  //el => el.innerHTML is text
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
})
