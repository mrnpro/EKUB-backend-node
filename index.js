require('dotenv').config()
const { app } = require("./app");
const port = 5000;

app.listen(process.env.PORT || port, () => { console.log(`Server started on port ${port}`) })