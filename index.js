const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

const app = express();

app.use(
  express.json({
    extended: false,
  })
);

require("./database");

app.use("/api/url", require("./routes/urlRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));

module.exports = app;
