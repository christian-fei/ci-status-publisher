var expect = require('chai').expect

var TCPSockets = require('../modules/TCPSockets')
var net = require('net')

describe('TCPSockets', function () {
  var tcpSockets

  beforeEach(function() {
    tcpSockets = new TCPSockets()
  })


  it('adds a client to the list', function () {
    var socket = new net.Socket()
    tcpSockets.add(socket)
    expect( tcpSockets.sockets.length ).to.equal( 1 )
    socket.destroy()
  })

  it('removes a client from the list', function () {
    var socket = new net.Socket()
    tcpSockets.add(socket)
    expect( tcpSockets.remove(socket).length ).to.equal( 0 )
    socket.destroy()
  })

})