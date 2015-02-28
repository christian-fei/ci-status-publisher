var express = require('express')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , net = require('net')
  , JSONSocket = require('json-socket')
  , TCPClients = require('./modules/TCPClients')

var WEBHOOK_PUBLISHER_HTTP_PORT = process.env.WEBHOOK_PUBLISHER_HTTP_PORT || 3000
var WEBHOOK_PUBLISHER_TCP_PORT = process.env.WEBHOOK_PUBLISHER_TCP_PORT || 3001

var app = express()
var tcpServer = net.createServer()
var tcpClients = new TCPClients()

app.use(bodyParser.json())
app.use(morgan('combined'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/hook', function (req, res) {
  console.log( '-- hook:', req.body )
  printConnectedTCPClients()
  tcpClients.broadcast(req.body)
  res.end()
})


var httpServer = app.listen(WEBHOOK_PUBLISHER_HTTP_PORT, function () {
  var port = httpServer.address().port
  console.log('-- HTTP server listening at http://localhost:%s', port)
})

tcpServer.listen(WEBHOOK_PUBLISHER_TCP_PORT, function(){
  console.log( '-- TCP server listening on http://localhost:' + WEBHOOK_PUBLISHER_TCP_PORT )
})


tcpServer.on('connection',function (socket){
  var name = socket.remoteAddress + ':' + socket.remotePort + ':' + socket._handle.fd
  socket = new JSONSocket(socket)
  socket.name = name
  console.log( '-- TCP client connected', socket.name )
  tcpClients.add(socket) 
  printConnectedTCPClients()

  socket.on('end', function () {
    console.log( '-- TCP client disconnected', socket.name )
    tcpClients.remove(socket)
    printConnectedTCPClients()
  }) 
})

function printConnectedTCPClients(){
  console.log( '-- clients' )
  tcpClients.clients.forEach(function(client){
    console.log( '---- ', client.name )
  })  
}