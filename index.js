var http = require('http')
  , router = require('node-simple-router')()
  , url  = require('url')
  , net = require('net')
  , morgan = require('morgan')
  , logger = morgan('combined')

var clientsTCP = []

var WEBHOOK_PUBLISHER_HTTP_PORT = process.env.WEBHOOK_PUBLISHER_HTTP_PORT || 3000
var WEBHOOK_PUBLISHER_TCP_PORT = process.env.WEBHOOK_PUBLISHER_TCP_PORT || 3001


function printClients(){
  console.log( 'clients' )
  clientsTCP.forEach(function(client){
    console.log( '- ', client.name )
  })  
}

router.any(function(){
  logger.apply(this,arguments)
})
router.post('/hook', function (req, res) {
  printClients()
  broadcastTCP(clientsTCP, JSON.stringify(req.body))
  res.end()
})


http
.createServer(router)
.listen(WEBHOOK_PUBLISHER_HTTP_PORT)
console.log( 'HTTP server listening on localhost:'+WEBHOOK_PUBLISHER_HTTP_PORT )



net.createServer(function (socket){
  socket.name = socket.remoteAddress + ':' + socket.remotePort + ':' + socket._handle.fd
  console.log( 'TCP client connected', socket.name )
  clientsTCP.push(socket) 
  printClients()
  
  socket.on('end', function () {
    console.log( 'TCP client disconnected', socket.name )
    clientsTCP.splice(clientsTCP.indexOf(socket), 1)
    printClients()
  }) 
}).listen(WEBHOOK_PUBLISHER_TCP_PORT)

function broadcastTCP(clients, message) {
  clients.forEach(function (client) {
    client.end(message)
  })
}

console.log( 'TCP server listening on localhost:'+WEBHOOK_PUBLISHER_TCP_PORT )