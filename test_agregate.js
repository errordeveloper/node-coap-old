var util = require ('util');

COAP = { debugHook : function (object) { console.log (util.inspect (object)); } };


COAP.OptionsTable = require ('./options');
COAP.OptionsAgregate = require ('./agregate');



COAP.OptionsAgregate.append(1, {mock: 0, fuck: 1});
COAP.OptionsAgregate.append(2, {mock: 0, fuck: 1});
COAP.OptionsAgregate.append(2, {mock: 3, fuck: 4});
COAP.OptionsAgregate.append(3, {dick: 8, suck: 0});
