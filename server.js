const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//thirdpartymiddleware because why tf not amirite
server.use(cors());
server.use(morgan('dev'));
server.use(helmet());

//custom middleware
server.use(logger);

function logger(req, res, next) {
  console.log("Request type:", )
};

module.exports = server;
