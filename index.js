var http = require('http')
  , router = require('node-simple-router')()
  , url  = require('url')
  , morgan = require('morgan')
  , logger = morgan('combined')

router.any(function(){
  logger.apply(this,arguments)
})

router.get('/hook',function(req, res) {
  res.end('incoming hook')
})


http
.createServer(router)
.listen(process.env.WEBHOOK_PUBLISHER_HTTP_PORT || 3000)