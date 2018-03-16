
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 3000;
var app = express();

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/scrapercart" ;
mongoose.connect(MONGODB_URI,function(err){
  if(err){ 
    console.log("Mongoose Connection Error: "+err);
  }
}),

app.get("/scrape", function(req, res) {
  axios.get("http://www.sciencemag.org/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h2.media__headline").each(function(i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      //dont add links not containing sciencemag
      if(result.link && result.link.indexOf("sciencemag")!== -1){
        db.Article.create(result).then(function(dbArticle){
        }).catch(function(err) {
          return res.json(err);
        });
      }
    });
    res.redirect("/articles");
  });
});

app.get("/", function(req, res){
  res.redirect("/articles");
});

app.get("/articles", function(req, res) {
  db.Article.find({}).then(function(dbArticle){
    res.render("index",{articles: dbArticle});
  }).catch(function(err) {
    res.json(err);
  });
});

app.get("/saved-articles", function(req, res) {
  db.Article.find({saved:true}).then(function(dbArticle){
    res.render("saved-articles",{articles: dbArticle});
  }).catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id }).populate("note").then(function(dbArticle){
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

//change the saved status of the article 
app.put("/marksaved/:id/", function(req, res) {
  db.Article.findOneAndUpdate({_id:req.params.id},{$set:{"saved":true}}
  ).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

//change the saved status of the article 
app.put("/markunsaved/:id/", function(req, res) {
  db.Article.findOneAndUpdate({_id:req.params.id},{$set:{"saved":false}
  }).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

//save article
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body).then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  }).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

app.listen(PORT,function(){ 
  console.log("App running on port " + PORT + "!"); 
});

