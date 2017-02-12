const express = require('express')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
}).single('file')

const port = process.env.PORT

const app = express()

app.use(express.static('public'))

app.post('/filesize', upload, function(req, res) {
  res.json({
    size: req.file.size
  })
})

app.listen(port, function() {
  console.log('FreeCodeCamp File Metadata Microservice listening to port ' + port + '!')
})
