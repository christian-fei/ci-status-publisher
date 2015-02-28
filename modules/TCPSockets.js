module.exports = TCPSockets

var crypto = require('crypto')

function TCPSockets(){
  this.sockets = []
  this.add = function(socket){
    socket.id = crypto.randomBytes(20).toString('hex')
    this.sockets.push(socket)
    return this.sockets
  }
  this.remove = function(socket){
    this.sockets.forEach(function(_connections, index){
      if( _connections.id === socket.id ) this.sockets.splice(index, 1)
    }.bind(this))
    return this.sockets
  }

  this.broadcast = function(message){
    this.sockets.forEach(function (socket) {
      socket.sendMessage ? socket.sendMessage(message) : socket.write(message)
    })
  }
}