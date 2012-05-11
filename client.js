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

var msg = COAP.helpers.newMessage('PUT', '/foo');
with (msg) {
  origin= {address: '::1', port: 5683};
  messageType= 'CON';
  messageID= 2400239;
  options= {
    //'Accept': [0xf00f],
    //'Content-Type': 0xdead,
    'Uri-Host': 'localhost',
    'Uri-Path': [ '.well-known', 'core' ],
    //'Token': '123'
  };
};

COAP.request.request(msg);
