var express = require('express')
var moment = require('moment')
var port = process.env.PORT || 1337
var app = express()

app.get('/', function(req, res) {
  res.send('FreeCodeCamp Timestamp Microservice by MunifTanjim')
})
app.get('/:time', function(req, res) {
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

app.listen(port, function() {
  console.log('Timestamp Microservice listening on port ' + port + '!')
})
