var express = require('express')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , net = require('net')
  , JSONSocket = require('json-socket')
  , TCPClients = require('./modules/TCPClients')
  , bunyan = require('bunyan')
  , bunyanFormat = require('bunyan-format')  
  , log = bunyan.createLogger({name: 'WEBHOOK_PUBLISHER', stream: bunyanFormat({ outputMode: 'short' })})

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
  log.info( '-- hook:', req.body )
  printConnectedTCPClients()
  tcpClients.broadcast(req.body)
  res.end()
})


var httpServer = app.listen(WEBHOOK_PUBLISHER_HTTP_PORT, function () {
  var port = httpServer.address().port
  log.info('-- HTTP server listening at http://localhost:%s', port)
})

tcpServer.listen(WEBHOOK_PUBLISHER_TCP_PORT, function(){
  log.info( '-- TCP server listening on http://localhost:' + WEBHOOK_PUBLISHER_TCP_PORT )
})


tcpServer.on('connection',function (socket){
  var name = socket.remoteAddress + ':' + socket.remotePort + ':' + socket._handle.fd
  socket = new JSONSocket(socket)
  socket.name = name
  log.info( '-- TCP client connected', socket.name )
  tcpClients.add(socket) 
  printConnectedTCPClients()

  socket.on('end', function () {
    log.info( '-- TCP client disconnected', socket.name )
    tcpClients.remove(socket)
    printConnectedTCPClients()
  }) 
})

function printConnectedTCPClients(){
  log.info( '-- clients' )
  tcpClients.clients.forEach(function(client){
    log.info( '---- ', client.name )
  })  
}