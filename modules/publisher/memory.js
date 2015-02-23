module.exports = MemoryPublisher

function MemoryPublisher(){
  if( !(this instanceof MemoryPublisher) )
    return new MemoryPublisher

  this.queue = function(){
    return []
  }
}