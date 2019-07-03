const { clearHash } = require('../services/cache');



module.exports = async (req,res,next) => {
  // it must use after creation of post
  // by this we let route handler do what it want
  await next();

  clearHash(req.user.id);
}