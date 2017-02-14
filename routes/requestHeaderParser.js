const express = require('express')
const Router = express.Router()
const path = require('path')

const info = {
  title: 'Request Header Parser Microservice',
  apis: [
    [
      'GET',
      '/whoami',
      '/whoami'
    ]
  ]
}

Router.get('/', (req,res) => {
  res.render('docLayout', info)
})

Router.get('/whoami', function(req,res){
  var ua = req.header('user-agent')
  res.send({
      ipaddress: req.ip,
      language: req.header('accept-language').split(',')[0],
      software: ua.substring(ua.indexOf('(')+1,ua.indexOf(')'))
  })
})

module.exports = Router
