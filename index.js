var http = require('http')
  , router = require('node-simple-router')()
  , url  = require('url')
  , morgan = require('morgan')
  , logger = morgan('combined')

var WEBHOOK_PUBLISHER_HTTP_PORT = process.env.WEBHOOK_PUBLISHER_HTTP_PORT || 3000


router.any(function(){
  logger.apply(this,arguments)
})


router.get('/hook',function(req, res) {
  res.end()
})


http
.createServer(router)
.listen(WEBHOOK_PUBLISHER_HTTP_PORT)
console.log( 'HTTP server listening on 127.0.0.1:'+WEBHOOK_PUBLISHER_HTTP_PORT )