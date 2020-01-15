const express = require('express');

const postsRouter = require('../posts/posts-router.js');


const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Blog</h>
      <p>Welcome to the Lambda Blog API</p>
    `);
  });

server.use('/api/posts', postsRouter);

module.exports = server;