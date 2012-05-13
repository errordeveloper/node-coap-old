#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');
var diff = require ('difflet')({
  indent: 2,
  comment: true
});

var stats = {};

var debugHook = function (ref, obj) {
  console.log(ref+util.inspect(obj, true, null, true));
};

var statsHook = function (ref, inc) {
  if (!stats.hasOwnProperty(ref)) {
    stats[ref] = inc;
  } else {
    stats[ref] += inc;
  }
  console.log("stats["+ref+"]= "+stats[ref]);
};

var COAP = require ('../')({}); //({debug: debugHook, stats: statsHook});

function get_time (test) {
  COAP.request({
    method: 'GET',
    host: '::1',
    path: 'time'
  }, function (rx) {
    test.ok(rx.payload instanceof Buffer,
        'Payload should be an instance of `Buffer`!');
    //XXX: It turns out that the time is not correct!
    //server_time = new Date(rx.payload.toString());
    //client_time = new Date();
    //console.log('Server time: '+server_time.toString());
    //console.log('Client time: '+client_time.toString());
    test.done();
  });
}

exports['GET coap://[::1]/time'] = get_time;

function get_info (test) {
  COAP.request({
    method: 'GET',
    host: '::1',
  }, function (rx) {
    test.ok(rx.payload instanceof Buffer,
        'Payload should be an instance of `Buffer`!');
    test.equal(rx.payload.toString().split('\n')[1],
        'Copyright (C) 2010--2012 Olaf Bergmann <bergmann@tzi.org>',
        'Copyright information has changed.');
    test.done();
  });
}

exports['GET coap://[::1]/'] = get_info;
  
/*
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
*/

// This doesn't work if we run multiple tests - it kills `nodeunit`!
// setTimeout(process.exit, 100);
setTimeout(function () {
  COAP.stack.EventEmitter.emit('close_request_socket');
}, 100)
