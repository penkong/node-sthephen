//clustering
//nodemon do not work with clustering
// it means only for every child have on thread not for whole cluster
// best cluster management system already writed use that = pm2 for production
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
//cluster manager is responsible for monitoring health of indi instance
//cluster manager after forking become false
// console.log(cluster.isMaster);
if (cluster.isMaster) {
  //cause index.js executed again in slave mode.
  //when we call fork node go back and exec index sec time
  // fork make cluster manager to false
  // can define thread pool
  // fork must equal to cores of cpu
  cluster.fork();
  cluster.fork();

} else {
  //i am child. slave mode
  const express = require('express');
  const crypto = require('crypto');
  const app = express();

  

  app.get('/', (req, res) => {
    crypto.pbkdf2('a','b',100000, 512, 'sha512', ()=> {
      res.send('hi there');
    });
  })

  app.get('/fast', (req, res) => {
    res.send('hi here');
  })

  app.listen(3000);
}