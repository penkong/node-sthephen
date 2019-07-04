const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;
//key grip to generate signature;
const Keygrip = require('keygrip');  
const keygrip = new Keygrip([keys.cookieKey]);

// id come from user factory
module.exports = user => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };

  // buffer session obj to string ddsgdfgerhgty56y54yu657uy65y-fdsg43ygg43tg34tgy-4yt3465346t34t34
  const session = Buffer
    .from(JSON.stringify(sessionObject))
    .toString('base64');

  const sig = keygrip.sign('session=' + session);
  return { session, sig };
}