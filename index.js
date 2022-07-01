require('dotenv').config()
const { app } = require("./app");
const port = 4000;

app.listen(process.env.PORT || port, '0.0.0.0', () => { console.log(`Server started on port ${port}`) })