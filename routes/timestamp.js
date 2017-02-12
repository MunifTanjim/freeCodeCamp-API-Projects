const express = require('express')
const Router = express.Router()
const moment = require('moment')
const path = require('path')

Router.use(
  express.static(
    path.resolve(__dirname + '../static/timestamp')
  )
)

Router.get('/:time', function(req, res) {
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

module.exports = Router
