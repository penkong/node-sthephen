// redis is not cool with promise
// redis always save strings and back strings
// client.flushall() clear redis
const mongoose = require('mongoose');
const redis = require('redis');
// we prefer promise to callback to use async
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);
// promisify help us bring back promise from func cb
client.hget = util.promisify(client.hget);

const { exec } = mongoose.Query.prototype;

// because of rerendering we use nesting strategy Hset hget
// define top level hash key
mongoose.Query.prototype.cache = function (options = {}) {
  // made by us
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  // to make it chain able
  return this;
}

// exec bring back for us a mongoose model
mongoose.Query.prototype.exec = async function () {

  // we dont cache big files  all logic bot is for small files.
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // make key for redis from id and name of collection
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // see if we have key in redis
  // top level key and next key.
  // mongoose need take back a model from mongo db
  // reference to model that represent query;
  // cl this.
  // bring us arr.
  // need to change doc to model instance
  // const doc = new this.model(JSON.parse(cachedVal));
  const cachedVal = await client.hget(this.hashKey,key);
  if (cachedVal) {
    const doc = JSON.parse(cachedVal);
    return Array.isArray(doc) 
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  // set duration
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;

}

// deleter of nested cache
module.exports = {
  // for use it make it middleware
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}










//     
//     const util = require('util');

//     

//     // that promise ify help us use await.
//     const cachedBlogs = await client.get(req.user.id);
//     if (cachedBlogs) {
//       return res.send(JSON.parse(cachedBlogs));
//     }

    
//     const blogs = await Blog.find({ _user: req.user.id });
//     res.send(blogs);
//     //save to redis for next time
//     client.set(req.user.id, JSON.stringify(blogs) );