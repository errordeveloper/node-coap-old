
var COAP = { opt : require ('./options') };

console.log(COAP.opt.longName(1)+' is of type `'+COAP.opt.dataType(1)+'`');
console.log('isCritical: '+COAP.opt.isCritical(1));

console.log('OPT_CONTENT_TYPE: '+COAP.opt.lookup['OPT_CONTENT_TYPE']);
