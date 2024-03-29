const express = require("express");
const auth_router = require("./routes/auth.router")
const user_router = require('./routes/user.router');
const account_router = require('./routes/account.router');
const choosePackage = require('./routes/choosePackage.router');
const history = require('./routes/history.router');
const recharge = require('./routes/recharge.router');
const days = require('./routes/days.router');
const penality = require('./routes/penality.router');




const app = express();
app.use(express.json());

app.use("/auth", auth_router);
app.use("/user", user_router);
app.use('/account', account_router);
app.use('/choosePackage', choosePackage);
app.use('/days', days);
app.use('/history', history);
app.use('/recharge', recharge);
app.use('/penality', penality);

module.exports = { app, };