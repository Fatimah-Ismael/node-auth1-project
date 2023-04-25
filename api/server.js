const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const Store = require('connect-session-knex')(session)
const knex = require('../data/db-config')
/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

const server = express();

server.use(session({
  name:'chocolatechip',
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
   // sameSite: 'none'
  },
  resave:false,
  saveUninitialized: false,
  Store: ({
    knex,
    createTable: true,
    clearInterval: 1000*60*10,
    tableName: 'session',
    sidfieldname: 'sid',
  })

}))
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)


server.get("/", (req, res) => {
  res.json({ api: "up" });
});

//server.use('*', (req, res, next)=>{
  //next({ status: 404, message: 'not found'})
//})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
