var expect = require('chai').expect

describe('always fails', function () {
  it('fails miserably', function (done) {
    expect( 42 ).to.equal( false )    
    done()
  });
})