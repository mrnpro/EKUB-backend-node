 const express = require('express');
 const { getAccount } = require('../controller/account/account.controller');
 const route = express.Router();
 route.get('/', getAccount);

 module.exports = route;