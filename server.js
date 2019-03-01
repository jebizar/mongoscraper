var express = require("express");
var exphbs = require("express-handlebars");
var path = require('path');
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", (req,res) => {
    res.render("index")
});

app.get("/save", (req,res) => {
    res.render("save")
});
var results = [];
var news = "https://www.livescience.com/strange-news"
axios.get(news).then((response) => {
    var $ = cheerio.load(response.data);

    $("h2").each((i,element) =>{
        var title = $(element).find("a").text();
        var link = news + $(element).find("a").attr("href");

       var article = {
           title:title,
           link:link
       };
       
       db.article.create(article).then((dbArticles) => {
           console.log(dbArticles) 
       })
       .catch(err => {
        console.log(err.message);
      });
        
    });

});

app.get("/api/scrape", (req,res) =>{
    
  db.article.find({}).then((dbArticle) => {
    res.json(dbArticle);
  })
  .catch(err => {
    res.json(err);
  });
});

app.post("/api/saved/:id", (req,res) => {
    db.article.findByIdAndUpdate({_id: req.params.id},{$set: {saved:true}}).then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch(err => {
        res.json(err);
      });
})

app.get("/api/saved", (req,res) =>{
    
    db.article.find({saved: true}).then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch(err => {
      res.json(err);
    });
  });

  app.post("/api/remove/:id", (req,res) => {
    db.article.findByIdAndUpdate({_id: req.params.id},{$set: {saved:false}}).then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch(err => {
        res.json(err);
      });
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });