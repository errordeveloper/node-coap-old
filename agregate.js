module.exports = ( function (OptionsTable, debugHook) {

  // var OptionsTable = require ('./options');

  var agregate = {

    container: {},

    setters: {
      append: function (n, x) {

        if (OptionsTable.isDefined(n)) {
          if (OptionsTable.allowMultiple(n)) {
            if (!agregate.container.hasOwnProperty(OptionsTable.getName(n))) {
              agregate.container[OptionsTable.getName(n)] = [x];
            } else {
              agregate.container[OptionsTable.getName(n)].push(x);
            }
          } else {
            agregate.container[OptionsTable.getName(n)] = x;
          }
        } else { throw new Error("COAP Option "+n+" is not defined!"); }
        if (debugHook) { debugHook(agregate.container); }
      }
    }
  }

  return agregate.setters; } (COAP.OptionsTable, COAP.debugHook) );
