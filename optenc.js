var OptionsTable = require('./options');

var util = require('util');
var unit = require('./buffers');

var encoder = function (request) {

  request.options.byNumber = [];

  /* Let's do all this array manipulations one by one for now - optimize later! */
  for (var option in request.options) {
    if (request.options.hasOwnProperty(option) &&
        OptionsTable.encode.isDefined(option)) {
      request.options.byNumber[OptionsTable.encode.getNumber(option)] = request.options[option];
    }
  }

  //console.log(util.inspect(request.options.byNumber));

  /* An option was not specified - apply default value (if defined) */
  for (var option = 1; option <= request.options.byNumber.length; option++) {
    if (request.options.byNumber[option] === undefined &&
        OptionsTable.decode.defaultValue(option) !== undefined) {
      request.options.byNumber[option] = OptionsTable.decode.defaultValue(option);
    }
  }

  var payload = new Buffer(1152);

  var n = 4;

  /* Get only those options which are now defined here */
  for (var option in request.options.byNumber) {
    console.log(OptionsTable.decode.getName(option)+
        ' = '+util.inspect(request.options.byNumber[option]));
    if (!OptionsTable.decode.allowMultiple(option)) {
      if (typeof request.options.byNumber[option] === 'object') {
        throw new Error("Malformed option in the `request` object!");
      } else if (request.options.byNumber[option].constructor === String) {
        payload[n] = 0x00;
        payload[n] |= (option << 4);
        payload[n] |= 0x0F & Buffer.byteLength(request.options.byNumber[option]);
        //TODO: extra bits in the length (i.e. < 0xFF)
        n += payload.write(request.options.byNumber[option], ++n);
      } else if (request.options.byNumber[option].constructor === Number) {
        var length = OptionsTable.decode.maxLength(option);
        payload[n] = 0x00;
        payload[n] |= (option << 4);
        payload[n] |= 0x0F & length;
        n += uint.write[length](payload, request.options.byNumber[option], ++n);
      } else if (request.options.byNumber[option].constructor === Buffer) {
        //TODO: 1st make opaque  type a hex encoded string!
        //TODO: extra bits in the length (i.e. < 0xFF)
      } /* else {
        throw new Error("Unidentified option in the `request` object!");
      } */
    } else if (OptionsTable.decode.allowMultiple(option) &&
        request.options.byNumber[option].constructor === Array) {
    }
  }

  console.log(util.inspect(payload));


  //callback(stack.ParseHeaders.encode(request));
};

encoder({
  options: {
    'Uri-Host': 'testrig',
    'Uri-Path': [ 'absc', 'dzy', 'xfg', 'search' ],
    'Uri-Query': [ 'h=1', 'w=2/h/fd', 'a=1', 'b=2' ]
  }
});
