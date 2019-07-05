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
      headless: true,
      args: ['--no-sandbox']
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
    await this.page.goto('http://localhost:3000/blogs');

    // it cause let all up lines exec then exec below
    await this.page.waitFor('a[href="/auth/logout"]');

  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate( _path =>{ 
      return fetch( _path , {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()); 
    }, path);
  }

  post(path, data) {
    return this.page.evaluate((_path, _data)=>{ 
      // puppeteer make whole of it to string and send it to chromium
      return fetch( _path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_data)
      }, path, data).then(res => res.json()); 
      // convert raw data to json
    });
  }

  execRequests(actions) {
    // it make all promises single promise
    return Promise.all(
      actions.map(({method, path, data}) => {
        return this[method] (path, data);
      })
    );
  }

}

module.exports = CustomPage;