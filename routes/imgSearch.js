const express = require('express')
const Router = express.Router()
const mongo = require('mongodb').MongoClient
const imgClient = require('google-images')
const path = require('path')

const cseID = process.env.CSE_ID
const cseAPI = process.env.CSE_API
const mongoUrl = process.env.MONGODB_URL

const img = new imgClient(cseID,cseAPI)

Router.use(
  express.static(
    path.resolve(__dirname + '../static/image-search')
  )
)

Router.get('/search/:keyword', function(req,res) {
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

Router.get('/latest', function(req,res) {
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

module.exports = Router
