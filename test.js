var dgram = require ('dgram');
var inspect = require ('util').inspect;
var server = dgram.createSocket ('udp6');


var ParseBuffer = function (buffer) {

  var request = {

    // first byte: version, type, and option count
    version:  (0xFF & ((buffer[0] & 0xC0) >>> 6)),
    type:     (0xFF & ((buffer[0] & 0x30) >>> 4)),
    options: {
      count:  (0x0F & buffer[0]),
      array: []
    },
    // second byte: method or response code
    code:     (0xFF & buffer[1]),
    // third and forth byte: transaction ID (TID)
    tid:      (buffer[2] << 8) | buffer[3],

  };
  
  var buffer = buffer.slice(4);

  var n = request.options.count;


  while (0 < n--) {

    var option = {
      start: 1,
      type: (buffer[0] >>> 4), // ? (0xF0 & buffer[0] >>> 4) + delta 
      length: (buffer[0] & 0x0F)

    };

    if (option.length === 15) {
      option.length += buffer[option.start++];
    }
    option.end = option.start + option.length;

    /*
    if (0 != (option.type & 0x01)) {
      throw new Error("COAP option type is not elective!");
    }
    */
    if (0 != (option.type % 14)) { // OPTION_TYPE_FENCEPOST = 14
      option.code = buffer.slice(option.start,option.end);
      request.options.array.push(option);
    }
    buffer = buffer.slice(option.end);
  }

  request.payload = buffer;

  return request;

}

server.on ('message', function (buf, rinfo) {
  console.log ('<= '+rinfo.address+':'+rinfo.port+' ['+inspect(buf)+']');

  req = ParseBuffer (buf);

  console.log (inspect(req));

  while (0 < req.options.count--) {
    //console.log (inspect(req.options.array[req.options.count]));
  }

});

server.on ('listening', function () {
  console.log ('=+ '+server.address().address+':'+server.address().port);
});



server.bind(5683);
