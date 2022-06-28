const express = require('express');
const { recharge } = require('../controller/recharge/recharge.controller');

const route = express.Router();
route.get('/', recharge);

module.exports = route;