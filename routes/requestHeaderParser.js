const express = require('express')
const Router = express.Router()
const path = require('path')

Router.use(
  express.static(
    path.resolve(__dirname + '../static/request-header-parser')
  )
)

Router.get('/whoami', function(req,res){
  var ua = req.header('user-agent')
  res.send({
      ipaddress: req.ip,
      language: req.header('accept-language').split(',')[0],
      software: ua.substring(ua.indexOf('(')+1,ua.indexOf(')'))
  })
})

module.exports = Router
