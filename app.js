const express = require('express')
const mongo = require('mongodb').MongoClient
const validator = require('validator')
const basecoder = require('./base-coder')

var port = process.env.PORT || 1337
var mongoUrl = process.env.MONGODB_URL || "localhost:27017/freecodecamp"
var appUrl = process.env.APP_URL || 'localhost:1337'
var app = express()

app.get('/', function(req,res) {
  res.send('FreeCodeCamp Url Shortner Microservice by MunifTanjim')
})

app.get('/:short_id', function(req,res) {
  var short_id = req.params.short_id
  mongo.connect('mongodb://' + mongoUrl, function(err,db) {
    if(err) throw err
    var list = db.collection('shorturl_list')
    list.findOne({
      _id: basecoder.decode(short_id)
    }, function(err,doc) {
      if(err) throw err
      if(doc) res.redirect(doc.url)
      else res.send('invalid shorturl')
      db.close()
    })
  })
})

app.get('/new/:url(*)', function(req,res) {
  var url = req.params.url
  if (!validator.isURL(url, { require_protocol: true })) {
    res.send({
      error: 'Wrong url format, make sure you have a valid protocol and real site.'
    })
  } else {
    mongo.connect('mongodb://' + mongoUrl, function(err,db) {
      if(err) throw err
      var list = db.collection('shorturl_list')
      var counter = db.collection('shorturl_counter')

      initInsertUrl(counter, list)
    })
  }

  function initInsertUrl(counter, list) {
    counter.findOneAndUpdate({
      _id: 'counter'
    }, {
      $inc: { url_count: 1 }
    }, function(err, result) {
      if(err) throw err
      insertUrl(list, result)
    })
  }

  function insertUrl(list, counterResult) {
    list.insertOne({
      _id: counterResult.value.url_count,
      url: url
    }, postInsertUrl)
  }

  function postInsertUrl(err, result) {
    if(err) throw err
    res.send({
      original_url: url,
      short_url: appUrl + '/' + basecoder.encode(result.ops[0]._id)
    })
  }
})

app.listen(port, function() {
  console.log('Url Shortner Microservice listening to port ' + port +'!')
})
