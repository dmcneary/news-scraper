var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String,
    unique: true
  },
  imgLink: {
      type: String
  },
  summary: {
      type: String
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
}, { autoIndex: false } );

articleSchema.index({link: 1})




var Article = mongoose.model("Article", articleSchema);

module.exports = Article;