const express = require('express')
const Router = express.Router()
const mongo = require('mongodb').MongoClient
const validator = require('validator')
const path = require('path')
const baseCoder = require('../lib/baseCoder')

const mongoUrl = process.env.MONGODB_URL
const urlShortnerApp = process.env.URL_SHORTNER_APP_URL

const info = {
  title: 'URL Shortner Microservice',
  apis: [
    [
      'GET',
      '/<shortcode>',
      '/2'
    ], [
      'GET',
      '/new/<url>',
      '/new/https://www.freecodecamp.com'
    ]
  ]
}

Router.get('/', (req,res) => {
  res.render('docLayout', info)
})

Router.get('/:short_id', function(req,res) {
  var short_id = req.params.short_id
  mongo.connect(mongoUrl, function(err,db) {
    if(err) throw err
    var list = db.collection('shorturl_list')
    list.findOne({
      _id: baseCoder.decode(short_id)
    }, function(err,doc) {
      if(err) throw err
      if(doc) res.redirect(doc.url)
      else res.send('invalid shorturl')
      db.close()
    })
  })
})

Router.get('/new/:url(*)', function(req,res) {
  var url = req.params.url
  if (!validator.isURL(url, { require_protocol: true })) {
    res.send({
      error: 'Wrong url format, make sure you have a valid protocol and real site.'
    })
  } else {
    mongo.connect(mongoUrl, function(err,db) {
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
      short_url: urlShortnerApp + '/' + baseCoder.encode(result.ops[0]._id)
    })
  }
})

module.exports = Router
