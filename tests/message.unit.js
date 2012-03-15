#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');

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

COAP.stack.ParseMessage.encode({
  protocolVersion: 1,
  connectionType: 'CON',
  transactionID: 2000,
  requestCode: 'GET',
  options: {
    'Max-Age': 2389123767,
    'Uri-Port': 18967,
    'Accept': 61455, //0xf00f,
    'Content-Type': 57005, //0xdead,
    'Uri-Host': 'locahost',
    'Uri-Path': [ 'a', 'd', 'x', 's' ],
    'Uri-Query': [ 'h=1', 'w=2', 'a=1', 'b=2' ]
  }
}, function (buffer) {
  COAP.stack.ParseMessage.decode(buffer, {address: '::1', port: 1009});
});
