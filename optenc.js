var OptionsTable = require('./options');

var util = require('util');
var uint = require('./integer');

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

  function setOptionHeader(buffer, offset, delta, length) {
    if (length < 15) {
      buffer[offset] = (0x0F & length) | (0xF0 & delta << 4);
      return 1;
    } else {
      buffer[offset] = 0x0F | (0xF0 & delta << 4);
      buffer[offset+1] = 0xFF & (length - 15);
      return 2;
    }
  }

  function setOption(buffer, offset, delta, data) {
    if (typeof data === 'object') {
      throw new Error("Malformed option in the `request` object!");
    } else if (data.constructor === String) {
      var length = Buffer.byteLength(data);
      offset += setOptionHeader(buffer, offset, delta, length);
      offset += buffer.write(data, offset);
    } else if (data.constructor === Number) {
      /* Using `maxLength` of the given option is the best decition. */
      var length = OptionsTable.decode.maxLength(option);
      offset += setOptionHeader(buffer, offset, delta, length);
      offset += uint.write[length](buffer, data, offset);
      return offset;
    } else {
      throw new Error("Unidentified option in the `request` object!");
    }
  }

  var payload = new Buffer(1152);

  var n = 4, // Offset
      d = 0, // Delta
      p = 0; // Previous

  /* Iterate over sorted options */
  for (var option in request.options.byNumber) {
    if (!OptionsTable.decode.allowMultiple(option)) {
      d = option - p; p = option;
      n += setOption(payload, n, d, request.options.byNumber[option]);
    } else if (OptionsTable.decode.allowMultiple(option) &&
        request.options.byNumber[option].constructor === Array) {
      for (var subopt in request.options.byNumber[option]) {
        d = option - p; p = option;
        n += setOption(payload, n, d, request.options.byNumber[option][subopt]);
      }
    } else {
      throw new Error("Malformed option in the `request` object!");
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
