const express = require('express');
const { choosePackage, getPackages } = require('../controller/choose_package/choosePackage.controller')
const route = express.Router();
route.get('/', getPackages);
route.post('/:pkg', choosePackage)

module.exports = route;