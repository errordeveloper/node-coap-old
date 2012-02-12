module.exports = ( function (OptionsTable, ParserInerface, debugHook) {

  // var OptionsTable = require ('./options');

  var agregate = {

    container: {},

    setters: {
      append: function (source, port, transaction, option, code) {

        /* We probably don't want to create a global state
         * variable really, so store the options here and
         * may be we could actually forget them depending
         * on `Max-Age` by doing this:
         * setTimout(function forget () {
         *   COAP.Hooks.AgregatorForgotten(container[source][transaction]);
         *   container[source][transaction] = { };
         * }, OptionsTable['Max-Age']*1000);
         */

        /* Storing by `[IP][TID]` seems natural, however
         * the IPs may change and a hijack is possible!
         * TODO: can we overvome this flow somehow? */
        if (!agregate.container.hasOwnProperty(source)) {
          agregate.container[source] = { };
        }
        if (!agregate.container[source].hasOwnProperty(port)) {
          agregate.container[source][port] = { };
        }
        if (!agregate.container[source][port].hasOwnProperty(transaction)) {
          agregate.container[source][port][transaction] = { };
        }

        var options = agregate.container[source][port][transaction]; // just a shortcut

        switch (OptionsTable.dataType(option)) {
          case 'uint':
            var data = code.readUInt8(0);
            break;
          case 'string':
            var data = code.toString(0);
            break;
          case 'opaque':
            var data = new Buffer(code.length);
            code.copy(data);
            break;
        }

        if (OptionsTable.isDefined(option)) {
          if (OptionsTable.allowMultiple(option)) {
            if (!agregate.container.hasOwnProperty(OptionsTable.getName(option))) {
              options[OptionsTable.getName(option)] = [data];
            } else {
              options[OptionsTable.getName(option)].push(data);
            }
          } else {
            options[OptionsTable.getName(option)] = data;
          }
        } else { throw new Error("COAP Option "+option+" is not defined!"); }
        if (debugHook) {
          debugHook('agregate.container = ',
              agregate.container);
          debugHook('agregate.container[source][port][transaction] = ',
              agregate.container[source][port][transaction]);
        }

      }
    }
  }

  return agregate.setters; } (COAP.OptionsTable, COAP.ParserInerface, COAP.debugHook) );
