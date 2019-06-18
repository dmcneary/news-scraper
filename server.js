// packages
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exhbs = require("express-handlebars");
var PORT = process.env.PORT || 8000;
var app = express();
var htmlRoutes = require("./routes/htmlRoutes");
var apiRoutes = require("./routes/apiRoutes");

// middleware
app.use(logger("dev"));
app.engine("handlebars", exhbs({ extname: "handlebars", defaultLayout: "main", layoutsDir: __dirname + "/views/layouts/" }));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/", htmlRoutes);
app.use("/", apiRoutes);

//db
var MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI || "mongodb://127.0.0.1/mongoHeadlines", { useNewUrlParser: true })
        .catch(function(err){ 
          if ( err.hasOwnProperty("errorLabels") && err.errorLabels.includes( "TransientTransactionError") ) {
            console.log("TransientTransactionError, connection rejected (likely by public network) - try again on a different WiFi network...");
          } else {
          console.log(err) 
          }
});
// start
app.listen(PORT, function() { console.log("Express server running on port " + PORT + " - we're doing it live!"); });
