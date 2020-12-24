const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = {
	scrapeCtrler: function (req, res) {
		const home = "https://apnews.com";
		axios
			.get(home)
			.then(function (response) {
				var $ = cheerio.load(response.data);
				var articles = [];
				$("article.cards")
					.children("div[data-key='feed-card-wire-story-with-image']")
					.each(function (i, element) {
						var result = {};
						result.title = $(element)
							.children(".CardHeadline")
							.children("a[data-key='card-headline']")
							.children("h1")
							.text();
						result.link =
							home +
							$(element).children("a[data-key='story-link']").attr("href");
						result.summary = $(element)
							.children("a[data-key='story-link']")
							.children("div.content")
							.children("p")
							.text();
						//result.imgLink = $(element).children("a img").attr("src");
						if (result.title && result.link) {
							articles.push(result);
						}
					});
				res.redirect("/");
				return articles;
			})
			.then(function (articles) {
				return db.Article.create(articles);
			})
			.catch(function (err) {
				console.log(err);
			});
	},
};
