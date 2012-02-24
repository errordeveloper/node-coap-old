var util = require ('util');

var coap = require ('../../server')
  ({ debug: function (ref, obj) { console.log(ref+util.inspect(obj)); } })

var server = coap.createServer(function (req) {
  console.log('<= '+util.inspect(req));
  server.close();
});

server.events.on('request', function (req) {
  console.log('<= '+util.inspect(req));
  server.close();
});

server.events.emit('talkback', { hello: "Test!" });

server.listen();
