const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
// const _ =require('lodash');
// require('dotenv').config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("articles", articleSchema);

/////////////////////////////// Request targetting all articles ///////////////////////////////////////////////

app.route("/articles")
    //Get all articles
    .get((req, res) => {
        Article.find(function (err, foundarticles) {
            if (!err)
                res.send(foundarticles);
            else
                res.send(err);
        });
    })
    //Post into articles
    .post((req, res) => {

        const newarticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newarticle.save(function (err) {
            if (!err)
                res.send("Article saved Successfully");
            else
                res.send(err);
        });
    })
    //Delete Many
    .delete((req, res) => {
        Article.deleteMany(function (err) {
            if (!err)
                res.send("Deleted all docs successfully");
            else
                res.send(err);
        });
    });

/////////////////////////////// Request targetting a specific articles ///////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundarticle)=>{
        if(foundarticle)
            res.send(foundarticle);
        else
            res.send("No document found");
    })
})
    //update the document entirely
.put((req,res) => {
    Article.updateOne(
        {title:req.params.articleTitle},
        {   
            title:req.body.title,
            content:req.body.content
        },
        (err)=>{
            if(err)
                res.send(err)
            else
                res.send("Updated Document successfully");
        });
})
.patch((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body},
        (err)=>{
            if(err)
                res.send(err)
            else
                res.send("Updated Document successfully");
        });
})
.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err)=>{
            if(!err)
                res.send("Deleted document successfully");
            else
                res.send(err);
        });
});

app.listen(3000, function () {
    console.log('Server running ar port 3000');
});