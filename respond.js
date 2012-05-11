module.exports = ( function Respond () {

  var responder = {
    socket: COAP.dgram.createSocket('udp6'),
    respond: function (message) {
      COAP.stack.ParseMessage.encode(message, function (buffer) {
        socket.send(message, 0, message.length, client.address, client.port, function (err, bytes) {
          if (err) { throw err; }
          client.close();
        });
      }); }
  }

  return { }; } () );
