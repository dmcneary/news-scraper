const db = require("../models");

module.exports = {
	articlesCtrler: function (req, res) {
		db.Article.find()
			.limit(20)
			.sort({ _id: -1 })
			.then(function (dbArticle) {
				return res.json(dbArticle);
			});
	},
};
