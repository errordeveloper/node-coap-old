module.exports = ( function RequestModule (dgram, stack, hooks, helpers, params) {

  var socket = dgram.createSocket ('udp6');
  // XXX: We could do this, but may be we need
  // an abstract wrapper actually?
  //var socket6 = dgram.createSocket ('udp6');
  //if (params.ipv6_only === undefined) {
  //  var socket4 = dgram.createSocket ('udp4');
  //}

  socket.on('message', function (response, rinfo) {
    console.log(rinfo);
  });

  var request = function MakeRequest (options, callback) {
    var con = options.confirmable || true;
    var rst = options.reset || false;
    var port = options.port || 5683;
    var path = options.path || '/';
    var host = options.host;
    if (host === undefined) {
      throw new Error('No target host provided!');
    }

    var message = {
      protocolVersion: 1,
      messageID: Math.round(Math.random()*10000),
      messageType: 'CON',
      messageCode: [
        undefined,
        'GET',
        'POST',
        'PUT',
        'DELETE'
      ].indexOf(options.method),
      options: {}
    };

    with (message) {
      if (messageCode === -1) {
        throw new Error('Invalid COAP request method `'+arguments[0].method+'`!');
      }
      if(!con) {
        messageType = 'NON';
      }
      if(rst) {
        messageType = 'RST';
      }
      options = helpers.MakeURI(path);
    }

    //console.log(message);
    stack.ParseMessage.encode(message, function (payload) {
      //console.log(message);
      var length = 0;
      if (options.method === 'GET' || options.method === 'DELETE') {
        // We need to drop the tail of the pre-allocated buffer
        // when it is not in use, i.e. doing a GET or a DELETE.
        length = message.optionsLength;
      } else {
        // In the case of PUT or GET request - call the callback which
        // should write data into our payload and return the length.
        // That gives us the actual length of the datagram.
        // XXX: This may be blocking, however:
        // - the buffer length is already allocated according to the
        //   recommended values in the COAP draft 09
        // - we will probably re-design it with Streams one day, so
        //   it shall be revisitied then
        length = callback(payload.slice(message.optionsLength));
      }
      socket.send(payload, 0, length, port, host, function (err, bytes) {
        if (err) { throw err; }

        if (hooks.stats) { hooks.stats('tx_count', 1); }
        if (hooks.stats) { hooks.stats('tx_bytes', bytes); }

        // TODO: handle
        // - ICPM (?)
        // - re-transmit and exponential back-off ... etc
      });
    });
  };

  return (request); } );
