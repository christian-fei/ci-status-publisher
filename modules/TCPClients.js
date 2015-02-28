module.exports = TCPClients

var crypto = require('crypto')

function TCPClients(){
  this.clients = []
  this.add = function(client){
    client.id = crypto.randomBytes(20).toString('hex')
    this.clients.push(client)
    return this.clients
  }
  this.remove = function(client){
    this.clients.forEach(function(_client, index){
      if( _client.id === client.id ) this.clients.splice(index, 1)
    }.bind(this))
    return this.clients
  }

  this.broadcast = function(message){
    this.clients.forEach(function (client) {
      client.sendMessage ? client.sendMessage(message) : client.write(message)
    })
  }
}