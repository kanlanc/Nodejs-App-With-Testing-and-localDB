const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

// instatiate the express app
const app = express();

// Routes Config
app.use(
  express.json({
    extended: false,
  })
);

require("./database");

// app.use("/", require("./routes/redirect"));
app.use("/api/url", require("./routes/urlRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`));
