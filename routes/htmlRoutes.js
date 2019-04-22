var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('index', { title: "News Scraper"})
})

router.get("/about", function (req, res) {
    res.render("about", { title: "News Scraper - About"})
})
module.exports = router;