var express = require('express')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , net = require('net')
  , JSONSocket = require('json-socket')
  , TCPSockets = require('./modules/TCPSockets')
  , bunyan = require('bunyan')
  , bunyanFormat = require('bunyan-format')  
  , log = bunyan.createLogger({name: 'WEBHOOK_PUBLISHER', stream: bunyanFormat({ outputMode: 'short' })})

var WEBHOOK_PUBLISHER_HTTP_PORT = process.env.WEBHOOK_PUBLISHER_HTTP_PORT || 3000
var WEBHOOK_PUBLISHER_TCP_PORT = process.env.WEBHOOK_PUBLISHER_TCP_PORT || 3001
var WEBHOOK_PUBLISHER_TCP_COMM_PORT = process.env.WEBHOOK_PUBLISHER_TCP_COMM_PORT || 3002

var app = express()
var tcpServer = net.createServer()
var tcpCommServer = net.createServer()
var tcpSockets = new TCPSockets()
var tcpCommSockets = new TCPSockets()

app.use(bodyParser.json())
app.use(morgan('combined'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/hook', function (req, res) {
  log.info( 'hook:', req.body )
  printSockets(tcpSockets.sockets)
  tcpSockets.broadcast(req.body)
  tcpCommSockets.broadcast(req.body)
  res.end()
})


var httpServer = app.listen(WEBHOOK_PUBLISHER_HTTP_PORT, function () {
  var port = httpServer.address().port
  log.info('HTTP server listening at http://localhost:%s', port)
})

tcpServer.listen(WEBHOOK_PUBLISHER_TCP_PORT, function(){
  log.info( 'TCP server listening on http://localhost:%s', WEBHOOK_PUBLISHER_TCP_PORT )
})

tcpCommServer.listen(WEBHOOK_PUBLISHER_TCP_COMM_PORT, function(){
  log.info( 'TCP COMM server listening on http://localhost:%s', WEBHOOK_PUBLISHER_TCP_COMM_PORT )
})


tcpServer.on('connection', function (socket){
  socket = new JSONSocket(socket)
  tcpSockets.add(socket) 
  log.info( 'TCP client connected', socket.id )
  printSockets(tcpSockets.sockets)

  socket.on('end', function () {
    log.info( 'TCP client disconnected', socket.id )
    tcpSockets.remove(socket)
    printSockets(tcpSockets.sockets)
  }) 
})


tcpCommServer.on('connection', function (socket){
  socket = new JSONSocket(socket)
  tcpCommSockets.add(socket) 
  log.info( 'TCP COMM server connected', socket.id )
  printSockets(tcpCommSockets.sockets)

  socket.on('end', function () {
    log.info( 'TCP COMM server disconnected', socket.id )
    tcpCommSockets.remove(socket)
    printSockets(tcpCommSockets.sockets)
  }) 
})


function printSockets(sockets, type){
  log.info( 'sockets' )
  sockets.forEach(function(client){
    log.info( '--', client.id )
  })  
}