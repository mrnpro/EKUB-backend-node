require('dotenv').config()
const { app } = require("./app");
const port = 6000;

app.listen(process.env.PORT || port, () => { console.log(`Server started on port ${port}`) })