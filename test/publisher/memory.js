var expect = require('chai').expect

describe('MemoryPublisher', function () {
  var MemoryPublisher = require('../../modules/publisher/memory')
  var memoryPublisher = new MemoryPublisher

  it('have an empty queue at the beginning', function () {
    var queue = memoryPublisher.queue()
    expect( queue ).to.be.ok
    expect( queue.length ).to.equal( 0 )
  })

})