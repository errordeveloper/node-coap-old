OptionsTable = require('./options');

var util = require('util');

var requestOptions = { 'Uri-Host': 'testrig', 'Uri-Path': [ 'absc', 'dzy', 'xfg', 'search' ], 'Uri-Query': [ 'h=1', 'w=2/h/fd', 'a=1', 'b=2' ] };

var encoder = function (request) {

  request.options.byNumber = [];

  /* Let's do all this array manipulations one by one for now - optimize later! */
  for (var option in request.options) {
    if (request.options.hasOwnProperty(option) && OptionsTable.encode.isDefined(option)) {
      request.options.byNumber[OptionsTable.encode.getNumber(option)] = request.options[option];
    }
  }

  console.log(util.inspect(request.options.byNumber));

  /* An option was not specified - apply default value (if defined) */
  for (var option = 1; option <= request.options.byNumber.length; option++) {
    if (request.options.byNumber[option] === undefined && OptionsTable.decode.defaultValue(option) !== undefined) {
      request.options.byNumber[option] = OptionsTable.decode.defaultValue(option);
    }
  }

  /* Get only those options which are now defined here */
  for (var option in request.options.byNumber) {
    console.log(OptionsTable.decode.getName(option)+'='+util.inspect(request.options.byNumber[option]));
  }

  //if (OptionsTable.allowMultiple(option) && request.options[option].constructor === Array) {
  //callback(stack.ParseHeaders.encode(request));
};

encoder({options: requestOptions});
