const mongoose = require('mongoose');

const { exec } = mongoose.Query.prototype;

mongoose.Query.prototype.exec = function () {

  return exec.apply(this, arguments);
}


// // redis is not cool with promise
//     // redis always save strings and back strings
//     // client.flushall() clear redis

//     const redis = require('redis');
//     const redisUrl = 'redis://127.0.0.1:6379';
//     const client = redis.createClient(redisUrl);

//     // we prefer promise to callback
//     const util = require('util');

//     // promisify help us bring back promise from func
//     client.get = util.promisify(client.get);

//     // that promise ify help us use await.
//     const cachedBlogs = await client.get(req.user.id);
//     if (cachedBlogs) {
//       return res.send(JSON.parse(cachedBlogs));
//     }

    
//     const blogs = await Blog.find({ _user: req.user.id });
//     res.send(blogs);
//     //save to redis for next time
//     client.set(req.user.id, JSON.stringify(blogs) );