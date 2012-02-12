var dgram = require ('dgram');
var inspect = require ('util').inspect;
var server = dgram.createSocket ('udp6');

COAP = {
  defaultPort : 5683,
  debugHook : function (reference, object)
  { console.log(reference+inspect(object)); } };

COAP.OptionsTable = require     ('./options');
COAP.OptionsAgregate = require  ('./agregate');
COAP.Headers = require          ('./headers');

var ParseBuffer = function (buffer, info) {

  var request = COAP.Headers.parse(buffer, info);

  var n = request.optionsCount;

  while (0 < n--) {

    var option = {
      start: 1,
      type: (request.payload[0] >>> 4),
      length: (request.payload[0] & 0x0F)

    };

    if (option.length === 15) {
      console.log('Got a longet option ...');
      option.length += request.payload[option.start++];
    }
    option.end = option.start + option.length;

    COAP.OptionsAgregate.append(info.address, info.port,
        request.transactionID, option.type,
        request.payload.slice(option.start, option.end));

    request.payload = request.payload.slice(option.end);
  }

  return request;

}

server.on ('message', function (buf, rinfo) {
  console.log ('<= '+rinfo.address+':'+rinfo.port+' ['+inspect(buf)+']');

  req = ParseBuffer (buf, rinfo);

  //console.log (inspect(req));

});

server.on ('listening', function () {
  console.log ('=+ '+server.address().address+':'+server.address().port);
});



server.bind(COAP.defaultPort);

