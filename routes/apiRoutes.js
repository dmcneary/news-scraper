const express = require("express");
const router = express.Router();
const { articlesCtrler } = require("../controllers/articles");
const { scrapeCtrler } = require("../controllers/scraper");

// scrape from AP
router.get("/scrape", scrapeCtrler);
// get articles from db
router.get("/articles", articlesCtrler);

module.exports = router;