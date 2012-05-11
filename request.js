module.exports = ( function Request (helpers) {

  var requester = {
    socket: helpers.createSocket('udp6'),
    request: function (message) {
      requester.socket.send(message, function (err, bytes) {
          if (err) { throw err; }
          //requester.socket.close();
      });
    }
  };

  return { request: requester.request }; } );
