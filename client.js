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

var COAP = require ('./')({debug: debugHook, stats: statsHook});

COAP.request({
  method: 'GET',
  host: '::1',
  path: '.well-known/core'
}, function (rx) {
  debugHook(rx);
  console.log(rx.payload.toString());
});
