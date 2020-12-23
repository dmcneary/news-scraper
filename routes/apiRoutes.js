var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var router = express.Router();
var db = require("../models")

// scrape
router.get("/scrape", function(req, res) {
  const home = "https://apnews.com";
  axios.get(home)
  .then(function(response) {
    var $ = cheerio.load(response.data);
    var articles = [];
    $("article.cards").children("div[data-key='feed-card-wire-story-with-image']")
    .each(function(i, element) {
      var result = {};
      result.title = $(element).children(".CardHeadline").children("a[data-key='card-headline']").children("h1").text();
      result.link = home + $(element).children("a[data-key='story-link']").attr("href");
      result.summary = $(element).children("a[data-key='story-link']").children("div.content").children("p").text();
      //result.imgLink = $(element).children("a img").attr("src");
      articles.push(result);
    });
    return articles;
  })
  .then(function(articles) {
    return db.Article.create(articles);
  })
  .catch(function(err) {
    console.log(err);
  });  
});

  
  // get all articles from db
router.get("/articles", function(req, res) {
  db.Article.find().sort({ _id: -1 })
  .then(function(dbArticle) {
      return res.json(dbArticle);
    });
});
  
// get article by id
router.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = router;