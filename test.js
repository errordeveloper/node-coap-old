var dgram = require ('dgram');
var inspect = require ('util').inspect;
var server = dgram.createSocket ('udp6');

COAP = { debugHook : function (reference, object) { console.log(reference+inspect(object)); } };

COAP.OptionsTable = require     ('./options');
COAP.OptionsAgregate = require  ('./agregate');
COAP.Headers = require   ('./headers');

var ParseBuffer = function (rinfo, buffer) {

  var request = COAP.Headers.parse(buffer);

  var buffer = request.payload;

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

    /*
    if (0 != (option.type & 0x01)) {
      throw new Error("COAP option type is not elective!");
    }
    */
    //if (0 != (option.type % 14)) { // OPTION_TYPE_FENCEPOST = 14
      COAP.OptionsAgregate.append(rinfo.address, rinfo.port,
          request.transactionID, option.type,
          request.payload.slice(option.start, option.end));
    //}
    request.payload = request.payload.slice(option.end); //, request.payload.length);
  }

  request.payload = buffer;

  return request;

}

server.on ('message', function (buf, rinfo) {
  console.log ('<= '+rinfo.address+':'+rinfo.port+' ['+inspect(buf)+']');

  req = ParseBuffer (rinfo, buf);

  console.log (inspect(req));

  //while (0 < req.options.count--) {
    //console.log (inspect(req.options.array[req.options.count]));
  //}

});

server.on ('listening', function () {
  console.log ('=+ '+server.address().address+':'+server.address().port);
});



server.bind(5683);
