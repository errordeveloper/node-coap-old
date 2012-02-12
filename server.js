var dgram = require ('dgram');
var inspect = require ('util').inspect;
var server = dgram.createSocket ('udp6');

COAP = {
  defaultPort : 5683,
  debugHook : function (reference, object)
  { console.log(reference+inspect(object)); } };

COAP.OptionsTable = require  ('./options');
COAP.ParseMessage = require  ('./message');
COAP.ParseHeaders = require  ('./headers');

server.on ('message', COAP.ParseMessage);

/*
server.on ('message', function (buffer, info) {
  console.log ('<= '+info.address+':'+info.port+' ['+inspect(buffer)+']');
  var request = COAP.ParseMessage(buffer, info);
});
*/

server.on ('listening', function () {
  console.log ('=+ '+server.address().address+':'+server.address().port);
});

server.bind(COAP.defaultPort);
