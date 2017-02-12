var express = require('express')
var port = process.env.PORT || 1337
var app = express()

app.enable('trust proxy')

app.get('/', function(req,res){
  res.send('FreeCodeCamp Request Header Parser Microservice by MunifTanjim')
})

app.get('/api/whoami', function(req,res){
  var ua = req.header('user-agent')
  res.send({
      ipaddress: req.ip,
      language: req.header('accept-language').split(',')[0],
      software: ua.substring(ua.indexOf('(')+1,ua.indexOf(')'))
  })
  console.log(req.headers)
})

app.listen(port, function() {
  console.log('Request Header Parser Microservice listening to port ' + port + '!')
})
