var util = require ('util');

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

if(process.env['DEBUG']) {
  var COAP = require ('./')({debug: debugHook, stats: statsHook});
} else {
  var COAP = require ('./')({});
}

var endpoints = ['.well-known/core', 'time', '/'];

for (var i in endpoints) {
  COAP.request({
    method: 'GET',
    host: '::1',
    path: endpoints[i]
  }, function (rx) {
    //console.log(this);
    console.log(rx.payload.toString());
  });
}

setTimeout(process.exit, 1000);
