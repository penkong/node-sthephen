// puppeteer make text send to chromioum it turn obj
// puppeteer for headless browser testing with chromiunm 
// pupet => browser => tab(page);
// const puppeteer = require('puppeteer');
// browser obj page obj
  // browser = await puppeteer.launch({
  //   headless: false
  // });
  // page = await browser.newPage();
const Page = require('./helpers/page');

let page;
beforeEach( async () => {
  
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach( async () => {
  // await browser.close();
  await page.close();
});


//el => el.innerHTML is text
test('the header has correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('should clicking login to auth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

//test.only
test('when signed in show logout button', async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
})


