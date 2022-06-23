const express = require("express");
const auth_router = require("./routes/auth.router")

const app = express();
app.use(express.json())
app.use("/auth", auth_router)




module.exports = { app, };