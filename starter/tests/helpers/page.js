const puppeteer = require('puppeteer');

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
        return customPage[property] || page[property] || browser[property];
      }
    })
  }

  constructor() {
    this.page = page;
  }
}

module.exports = CustomPage;