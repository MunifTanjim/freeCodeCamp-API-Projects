const express = require('express')

/* Routes */
const timestamp = require('./routes/timestamp')
const requestHeaderParser = require('./routes/requestHeaderParser')
const urlShortner = require('./routes/urlShortner')
const imgSearch = require('./routes/imgSearch')
const fileMetadata = require('./routes/fileMetadata')

const port = process.env.PORT

const app = express()

app.enable('trust proxy') // needed for request-header-parser
app.set('view engine', 'pug')

app.use(express.static('static'))

app.get('/', (req,res) => {
  res.render('landingPage', {
    title: '(freeCodeCamp) API Projects - MunifTanjim'
  })
})

app.use('/timestamp', timestamp)
app.use('/request-header-parser', requestHeaderParser)
app.use('/url-shortner', urlShortner)
app.use('/image-search', imgSearch)
app.use('/file-metadata', fileMetadata)

app.listen(port, function() {
  console.log('API server listening on port ' + port + '!')
})
