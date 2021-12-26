const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

// creating express route handler
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
          return res.json(url);
        }
        res.json(url);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(401).json("Invalid longUrl");
  }
});

router.get("/:code", async (req, res) => {
  try {
    db.loadDatabase({}, () => {
      var urls = db.getCollection("urlList");

      var url = urls.findOne({ urlCode: req.params.code });
      if (url) {
        console.log("its here");
        return res.json(url);
      } else {
        console.log("its here 1");
        return res.status(404).json("No URL Found");
      }
    });
  } catch (err) {
    console.log(err);
    console.log("its here 2");
    res.status(500).json("Server Error");
  }
});

module.exports = router;
