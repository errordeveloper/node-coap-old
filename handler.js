var util = require ('util');

var coap = require ('./server');

var stats = {};

var debugHook = function (ref, obj) {
  console.log(ref+util.inspect(obj, true, null, true));
};

var statsHook = function (ref, inc) {
  if (!stats.hasOwnProperty(ref)) {
    stats[ref] = inc;
  } else {
    stats[ref] += inc;
  }
  console.log("stats["+ref+"]= "+stats[ref]);
};

var requestHandler = function (req) {
  console.log('<= '+util.inspect(req));

  var uri = '/';
  if (req.options.hasOwnProperty('Uri-Path')) {
    uri += req.options['Uri-Path'].join('/');
  }
  if (req.options.hasOwnProperty('Uri-Query')) {
    uri += '?' + req.options['Uri-Query'].join('&');
  }
  console.log(req.requestCode + ' ' + uri);

};

var server = coap.createServer(requestHandler, {debug: debugHook, stats: statsHook}).listen();

//server.listen();
