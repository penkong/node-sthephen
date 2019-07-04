
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

afterEach( async () => {
  await browser.close();
});





//puppeteer make text send to chromioum it turn obj
//el => el.innerHTML is text
test('the header has correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('should clicking login to auth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
  // because of google testing for sign in don't work on CI server.
  // we use fake session and deceive cookie session believe it
});

//test.only
test('when signed in show logout button', () => {
  const id = '5453rsff4tjdsfjsdf4fs';
  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      usr: id
    }
  };

  // buffer session obj to string ddsgdfgerhgty56y54yu657uy65y-fdsg43ygg43tg34tgy-4yt3465346t34t34
  const sessionString = Buffer
    .from(JSON.stringify(sessionObject))
    .toString('base64');

  //key grip to generate signature;
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({name: 'session', value: sessionString});
  await page.setCookie({name: 'session.sig', value: sig});
  //after set cookie we refresh page for change happen
  await page.goto('localhost:3000');

  // it cause let all up lines exec then exec below
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
})




