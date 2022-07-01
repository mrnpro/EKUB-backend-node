const express = require('express');
const { Days } = require('../controller/days/days.controller')
const route = express.Router();
route.get('/', Days);

module.exports = route;