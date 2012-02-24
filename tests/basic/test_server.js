var util = require ('util');

var coap = require ('../../server');

var stats = {};

var debugHook = function (ref, obj) {
  console.log(ref+util.inspect(obj));
};

var statsHook = function (ref, inc) {
  if (!stats.hasOwnProperty(ref)) {
    stats[ref] = inc;
  } else {
    stats[ref] += inc;
  }
  console.log("stats["+ref+"]= "+stats[ref]);
};

var requestHandler = function (req) { console.log('<= '+util.inspect(req)); };

var server = coap.createServer(requestHandler, {debug: debugHook, stats: statsHook});

/* Alternativelly you can specify `requests` event handler
 * outside, just like the `http` module:
server.events.on('request', function (req) {
  console.log('<= '+util.inspect(req));
  //server.close();
});*/

/* This 'talkback' is currently not doing anything usefull:
server.events.emit('talkback', { hello: "Test!" }); */

server.listen();
