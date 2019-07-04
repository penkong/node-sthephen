const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

// proxy es2015 allow us access to some target object or multi target object
// proxy make decision when use page or custom page or any other obj
// new Proxy(
    //target(obj that broker want access to /manage multi obj),
    //handler(set of functions get: func(target, property))
    //)

class CustomPage {

  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    // combine access here
    // target == customPage
    // usr of browser cause of we dont worry about open close or what ever customPage do all of this
    return new Proxy(customPage, {
      get: function(target, property) {
        return browser[property] || page[property] || customPage[property];
      }
    })
  }

  constructor() {
    this.page = page;
    // this.browser = this.browser;
  }

  async login() {
    
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({name: 'session', value: session});
    await this.page.setCookie({name: 'session.sig', value: sig});
    //after set cookie we refresh page for change happen
    await this.page.goto('localhost:3000');

    // it cause let all up lines exec then exec below
    await this.page.waitFor('a[href="/auth/logout"]');

  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }
}

module.exports = CustomPage;