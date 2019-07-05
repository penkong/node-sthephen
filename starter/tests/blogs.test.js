
const Page = require('./helpers/page');

let page;
beforeEach( async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach( async () => {
  await page.close();
});

//for nest different test
describe('when logged in', async () => {
  beforeEach( async () => {
    await page.login();
    await page.click('a.btn-floating')
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'my title');
      await page.type('.content input', 'my content');
      await page.click('form button');
    });

    test('should submiting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('should submiting then saving blog to index page', async () => {
      await page.click('button.green');
      // must wait after ajax req
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');
      expect(title).toEqual('My title');
      expect(content).toEqual('My Content');
      
    });
    
  })
  
  describe('And using invalid inputs', async () => {
    beforeEach( async () => {
      await page.click('form button');
    });
    test('should form show an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      expect(titleError).toEqual('You must provide a value');      
      expect(contentError).toEqual('You must provide a value');      
    });
  });
  
});

describe('when not logged in', async () => {
  // for more concise for many routes we need
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 't',
        content: 'c'
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);
    for (const result of results) {
      expect(result).toEqual({error: 'You must log in!'});
    }
  })
  
  // test('user can not create a blog post', async () => {
  //   const result = await page.post('/api/blogs', {title: 'T', content: 'C'});
  //   expect(result).toEqual({error: 'You must log in!'});
  // });

  // test('user can not get a list of post', async () => {
  //   const result = await page.get('/api/blogs');
  //   expect(result).toEqual({error: 'You must log in!'});
  // });
  
});



