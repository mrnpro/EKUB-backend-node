const express = require('express');
const route = express.Router();
const login = require('../controller/auth/login.controller')
const register = require('../controller/auth/register.controller')
const change_password = require('../controller/auth/change_password.controller')


route.post('/login', login);

route.post('/register', register);

route.post('/change_password', change_password);
module.exports = route;