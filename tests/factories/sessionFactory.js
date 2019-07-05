const keys = require('../../config/keys');
const Buffer = require('safe-buffer').Buffer;

//key grip to generate signature;
const Keygrip = require('keygrip');  
const keygrip = new Keygrip([keys.cookieKey]);

// because of google testing for sign in don't work on CI server.
// we use fake session and deceive cookie session believe it

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


  // sig is signing cookie key and stable for security and check it with
  const sig = keygrip.sign('session=' + session);
  return { session, sig };

}