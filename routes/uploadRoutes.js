const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1'); // user id generator
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
})

module.exports = app => {
  app.get('/api/upload', requireLogin,(req,res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    // put info in folder like in buckets
    // generate pre signed url
    // get signed url func
    // put obj operation , params(bucketName, key(name of file-hashed), ContentType(images)) , cb
    s3.getSignedUrl('putObject', {
      Bucket: 'bucketName',
      ContentType: 'image/*',
      Key: key
    }, (err, url) => res.send({key, url}))
  });
};