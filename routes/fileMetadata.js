const express = require('express')
const Router = express.Router()
const multer = require('multer')
const path = require('path')

const upload = multer({
  storage: multer.memoryStorage()
}).single('file')

const info = {
  title: 'File Metadata Microservice',
  apis: [
    [
      'POST',
      '/filesize',
      'Check below...'
    ]
  ],
  includeFileUploader: true
}

Router.get('/', (req,res) => {
  res.render('docLayout', info)
})

Router.post('/filesize', upload, function(req, res) {
  res.json({
    size: req.file.size
  })
})

module.exports = Router
