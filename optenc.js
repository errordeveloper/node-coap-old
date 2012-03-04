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

  var payload = new Buffer(1152);

  var n = 4, // Offset
      d = 0, // Delta
      p = 0; // Previous

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

  /* Get only those options which are defined */
  for (var option in request.options.byNumber) {
    d = option - p;
    console.log(OptionsTable.decode.getName(option)+
        ' = '+util.inspect(request.options.byNumber[option]));
    if (!OptionsTable.decode.allowMultiple(option)) {
      if (typeof request.options.byNumber[option] === 'object') {
        throw new Error("Malformed option in the `request` object!");
      } else if (request.options.byNumber[option].constructor === String) {
        var length = Buffer.byteLength(request.options.byNumber[option]);
        n += setOptionHeader(payload, n, d, length);
        n += payload.write(request.options.byNumber[option], n);
      } else if (request.options.byNumber[option].constructor === Number) {
        /* Using `maxLength` of the given option is the best decition. */
        var length = OptionsTable.decode.maxLength(option);
        n += setOptionHeader(payload, n, d, length);
        n += uint.write[length](payload, request.options.byNumber[option], n);
      } /* else {
        throw new Error("Unidentified option in the `request` object!");
      } */
    } else if (OptionsTable.decode.allowMultiple(option) &&
        request.options.byNumber[option].constructor === Array) {
      for (var subopt in request.options.byNumber[option]) {
        if (typeof request.options.byNumber[option][subopt] === 'object') {
          throw new Error("Malformed option in the `request` object!");
        } else if (request.options.byNumber[option][subopt].constructor === String) {
          var length = Buffer.byteLength(request.options.byNumber[option][subopt]);
          if (subopt == 0) {
          n += setOptionHeader(payload, n, d, length);
          } else {
            n += setOptionHeader(payload, n, d, length);
          }
          n += payload.write(request.options.byNumber[option], n);
        } else if (request.options.byNumber[option][subopt].constructor === Number) {
          /* Using `maxLength` of the given option is the best decition. */
          var length = OptionsTable.decode.maxLength(option);
          if (subopt == 0) {
            n += setOptionHeader(payload, n, d, length);
          } else {
            n += setOptionHeader(payload, n, d, length);
          }
          n += uint.write[length](payload, request.options.byNumber[option][subopt], n);
        } /* else {
          throw new Error("Unidentified option in the `request` object!");
        } */
      }
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
