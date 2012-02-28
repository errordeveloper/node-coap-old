module.exports = ( function () {

  var createServer = function createServer(callback, hooks) {

    var COAP = {
      dgram: require ('dgram'),
      stack: {
        /* It's better to create the stack in one place. */
      },
      hooks: hooks
    };

    /* The actual stack is created here! */
    COAP.stack.EventEmitter = new (require ('events').EventEmitter)();
    COAP.stack.OptionsTable = require  ('./options');
    COAP.stack.ParseHeaders = require  ('./headers');
    COAP.stack.ParseMessage = require  ('./message')(COAP.stack, COAP.hooks);

    var socket = COAP.dgram.createSocket ('udp6');

    if (typeof callback === 'function') {
      COAP.stack.EventEmitter.on('request', callback);
    }

    COAP.server = {
      listen: function (port, address, callback) {
        socket.on('message', COAP.stack.ParseMessage.decode);
        if (typeof callback === 'function') {
          socket.on('listening', callback);
        }
        if (port === undefined && address === undefined) {
          socket.bind(5683);
        } else {
          socket.bind(port, address);
        }
      },
      respond: function (message) {
        var socket = COAP.dgram.createSocket('udp6');
        COAP.stack.ParseMessage.encode(message, function (buffer) {
          socket.send(message, 0, message.length, client.address, client.port, function (err, bytes) {
            if (err) { throw err; }
            client.close();
          });
        }); },
      close: function () { socket.close(); }
    };

    COAP.stack.EventEmitter.on('talkback', function (obj) {
      console.log('talkback: '+obj.hello);
    });

    return {
      events:   COAP.stack.EventEmitter,
      option:   COAP.stack.OptionsTable,
      listen:   COAP.server.listen,
      respond:  COAP.server.respond,
      close:    COAP.server.close,
    };
  };

  return { createServer: createServer }; } () );
