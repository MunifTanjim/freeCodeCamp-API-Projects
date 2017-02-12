const express = require('express')
const moment = require('moment')
const mongo = require('mongodb').MongoClient
const validator = require('validator')
const imgClient = require('google-images')
const multer = require('multer')

/* Environment Variables */
const port = process.env.PORT
const mongoUrl = process.env.MONGODB_URL
const urlShortnerApp = process.env.URL_SHORTNER_APP_URL
const cseID = process.env.CSE_ID
const cseAPI = process.env.CSE_API

const app = express()

app.enable('trust proxy') // needed for request-header-parser

/* Landing Page */
app.use(express.static('static'))

/* Timestamp Microservice */
app.use('/timestamp', express.static('static/timestamp'))

app.get('/timestamp/:time', function(req, res) {
  var time = req.params.time
  if(moment(time, "MMMM D, YYYY", true).isValid()) {
    res.send({
      unix: moment(time, "MMMM D, YYYY").format("X"),
      natural: time
    })
  } else if (moment(time, "X", true).isValid()) {
    res.send({
      unix: time,
      natural: moment(time, "X").format("MMMM D, YYYY")
    })
  }
})

/* Request Header Parser */
app.use('/request-header-parser', express.static('static/request-header-parser'))

app.get('/request-header-parser/whoami', function(req,res){
  var ua = req.header('user-agent')
  res.send({
      ipaddress: req.ip,
      language: req.header('accept-language').split(',')[0],
      software: ua.substring(ua.indexOf('(')+1,ua.indexOf(')'))
  })
})

/* URL Shortner Microservice */
app.use('/url-shortner', express.static('static/url-shortner'))

const baseCoder = require('./lib/baseCoder')

app.get('/url-shortner/:short_id', function(req,res) {
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

app.get('/url-shortner/new/:url(*)', function(req,res) {
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

/* Image Search Abstraction Layer */
app.use('/image-search', express.static('static/image-search'))

const img = new imgClient(cseID,cseAPI)

app.get('/image-search/search/:keyword', function(req,res) {
  let keyword = req.params.keyword
  let page = parseInt(req.query.offset)
  let options = {}

  if(!isNaN(page) && page >= 0)
    options.page = page + 1

  img.search(keyword, options)
    .then(buildResults)
    .then(function(results) {
      res.json(results)
      recordSearch(keyword)
    })

  function buildResults(images) {
    return new Promise(function(resolve, reject) {
      let results = images.map(function(image) {
        return {
          url: image.url,
          snippet: image.snippet,
          thumbnail: image.thumbnail.url,
          context: image.contextLink
        }
      })

      if(results)
        resolve(results)
      else
        reject(new Error('error while building results!'))
    })
  }

  function recordSearch(keyword) {
    mongo.connect(mongoUrl, function(err,db) {
      let history = db.collection('imgsearch')
      history.insertOne({
        term: keyword,
        when: new Date()
      })
      db.close()
    })
  }
})

app.get('/image-search/latest', function(req,res) {
  mongo.connect(mongoUrl, function(err,db) {
    let history = db.collection('imgsearch')
    history.find()
      .sort({when: -1})
      .limit(10)
      .toArray(function(err,docs) {
        res.json(docs.map(function(doc) {
          return {
            term: doc.term,
            when: doc.when
          }
        }))
        db.close()
      })
  })
})

/* File Metadata */
app.use('/file-metadata', express.static('static/file-metadata'))

const upload = multer({
  storage: multer.memoryStorage()
}).single('file')

app.post('/filesize', upload, function(req, res) {
  res.json({
    size: req.file.size
  })
})

app.listen(port, function() {
  console.log('API server listening on port ' + port + '!')
})
