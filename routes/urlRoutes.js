const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

const router = express.Router();

const db = require("../utils/db");

const baseUrl = "http:localhost:3000";

router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base URL");
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      db.loadDatabase({}, () => {
        var urls = db.getCollection("urlList");

        var url = urls.findOne({ longUrl });
        if (!url) {
          // Make new url here
          const shortUrl = baseUrl + "/" + urlCode;
          let url = urls.insert({ longUrl, shortUrl, urlCode });

          db.save();
          return res.status(200).json({ shortUrl: url.shortUrl });
        }
        res.json(url);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.status(401).json({ message: "Invalid longUrl" });
  }
});

router.get("/:code", async (req, res) => {
  try {
    db.loadDatabase({}, () => {
      var urls = db.getCollection("urlList");

      var url = urls.findOne({ urlCode: req.params.code });
      if (url) {
        return res.json({ longUrl: url.longUrl });
      } else {
        return res.status(404).json({ message: "No URL Found" });
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
