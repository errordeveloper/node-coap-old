var coap = require ('../../server');

var util = require ('util');

var server = coap({
  port: 5683,
  debugHook: function (ref, obj) { console.log(ref+util.inspect(obj)); }
});

server.events.on('request', function (req) {
  console.log('<= '+util.inspect(req));
});

server.events.emit('talkback', { hello: "Test!" });
