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
      listen: function (port, address) {
        socket.on('message', COAP.stack.ParseMessage.decode);


        if (port === undefined && address === undefined) {
          socket.bind(5683);
        } else {
          socket.bind(port, address);
        }
      },
      close: function () { socket.close(); }
    };

    COAP.stack.EventEmitter.on('talkback', function (obj) {
      console.log('talkback: '+obj.hello);
    });

    return {
      events: COAP.stack.EventEmitter,
      option: COAP.stack.OptionsTable,
      listen: COAP.server.listen,
      close:  COAP.server.close,
    };
  };

  return { createServer: createServer }; } () );
