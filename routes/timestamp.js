const express = require('express')
const Router = express.Router()
const moment = require('moment')
const path = require('path')

const info = {
  title: 'Timestamp Microservice',
  apis: [
    [
      'GET',
      '/<time>',
      '/September%2002,%202027<br />/1819821600'
    ]
  ]
}

Router.get('/', (req,res) => {
  res.render('docLayout', info)
})

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
