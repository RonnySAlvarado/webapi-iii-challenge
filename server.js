const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter.js');

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

server.use(express.json());

//thirdpartymiddleware because why tf not amirite
server.use(cors());
server.use(morgan('dev'));
server.use(helmet());

//custom middleware
server.use(logger);

server.use('/api/user', userRouter);
server.use('/api/post', postRouter);

function logger(req, res, next) {
  const currentTime = new Date();
  console.log("Request type: ", req.method);
  console.log("Request URL: ", req.url);
  console.log(currentTime.toISOString());
  next();
};

module.exports = server;
