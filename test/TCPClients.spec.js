var expect = require('chai').expect

var TCPClients = require('../modules/TCPClients')
var net = require('net')

describe('TCPClients', function () {
  var tcpClients

  beforeEach(function() {
    tcpClients = new TCPClients()
  })


  it('adds a client to the list', function () {
    var socket = new net.Socket()
    tcpClients.add(socket)
    expect( tcpClients.clients.length ).to.equal( 1 )
    socket.destroy()
  })

  it('removes a client from the list', function () {
    var socket = new net.Socket()
    tcpClients.add(socket)
    expect( tcpClients.remove(socket).length ).to.equal( 0 )
    socket.destroy()
  })

})