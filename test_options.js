
var COAP = { opt : require ('./options') };

console.log(COAP.opt.getName(1)+' is of type `'+COAP.opt.dataType(1)+'`');
console.log('isCritical: '+COAP.opt.isCritical(1));

console.log('Content-Type: '+COAP.opt.byName['Content-Type']);
