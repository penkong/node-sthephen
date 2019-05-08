//clustering
//nodemon do not work with clustering
const cluster = require('cluster');
//cluster manager after forking become false
// console.log(cluster.isMaster);
if (cluster.isMaster) {
  //cause index.js executed again in slave mode.
  cluster.fork();

} else {
  //i am child.
  const express = require('express');

  const app = express();

  app.get('/', (req, res) => {
    res.send('hi there');
  })

  app.listen(3000);
}