#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');
var diff = require ('difflet')({
  indent: 12,
  comment: true
});

var COAP = {
  dgram: require ('dgram'),
  stack: {
    /* It's better to create the stack in one place. */
  },
  hooks: {
           debug: function (ref, obj) { console.log(ref+util.inspect(obj, true, null, true)); }
         }
};

/* The actual stack is created here! */
COAP.stack.EventEmitter = new (require ('events').EventEmitter)();
COAP.stack.OptionsTable = require  ('./../options');
COAP.stack.ParseHeaders = require  ('./../headers');
COAP.stack.IntegerUtils = require  ('./../integer');
COAP.stack.ParseMessage = require  ('./../message')(COAP.stack, COAP.hooks);

msg = {
  protocolVersion: 1,
  messageType: 'CON',
  messageID: 2000,
  messageCode: 'GET',
  options: {
    //'Max-Age': 2389,
    'Uri-Port': 18967,
    'Accept': [0xf00f],
    'Content-Type': 0xdead,
    'Uri-Host': 'locahost',
    'Uri-Path': [ 'a', 'd', 'x', 's' ],
    'Uri-Query': [ 'h=1', 'w=2', 'a=1', 'b=2' ]
  }
}

COAP.stack.ParseMessage.encode(msg, function (buf) {
  COAP.stack.ParseMessage.decode(buf, {address: '::1', port: 1009},
    function(req) {
      with(req) {
        delete payload;
        delete byNumber;
        delete origin;
      }
      diff(msg, req).pipe(process.stdout);
    })
});
