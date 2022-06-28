const { getPenalityAmount, payPenality } = require('../controller/penality/penality.controller')

const express = require('express');
const route = express.Router();
route.get('/', getPenalityAmount);
route.post('/', payPenality);

module.exports = route;