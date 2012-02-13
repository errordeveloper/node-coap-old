module.exports = function (config) {

  var dgram = require ('dgram');
  var socket = dgram.createSocket ('udp6');
  
  var COAP = {
    setup: {
      port: config.port || 5683
    },
    stack: {
      /* It's better to create the stack in one place. */
    },
    hooks: {
      debug: config.debugHook || false
    }
  };
  
  var port = config.port || COAP.defaultPort;
  /* The actual stack is create here! */
  COAP.stack.EventEmitter = new (require ('events').EventEmitter)();
  COAP.stack.OptionsTable = require  ('./options');
  COAP.stack.ParseHeaders = require  ('./headers');
  COAP.stack.ParseMessage = require  ('./message')(COAP.stack, COAP.hooks);

  socket.on ('message', COAP.stack.ParseMessage);
  
  socket.bind(COAP.setup.port);

  COAP.stack.EventEmitter.on('talkback', function (obj) {
    console.log('Hello, '+obj.hello);
  });

  return {
    /* events: {
      on: COAP.stack.EventEmitter.on,
      emit: COAP.stack.EventEmitter.emit
            },*/
    events: COAP.stack.EventEmitter,
    option: COAP.stack.OptionsTable,
  };

};
