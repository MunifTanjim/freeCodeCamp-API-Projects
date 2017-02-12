const express = require('express')
const Router = express.Router()
const multer = require('multer')
const path = require('path')

const upload = multer({
  storage: multer.memoryStorage()
}).single('file')

Router.use(
  express.static(
    path.resolve(__dirname + '../static/file-metadata')
  )
)

Router.post('/filesize', upload, function(req, res) {
  res.json({
    size: req.file.size
  })
})

module.exports = Router
