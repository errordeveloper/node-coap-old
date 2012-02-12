module.exports = ( function (stack, hooks) {

  var agregate = {

    container: {},

    parse: function (messageBuffer, requestInfo) {

      var request = stack.ParseHeaders(messageBuffer, requestInfo);

      /* Storing by `[IP][TID]` seems natural, however
       * the IPs may change and a hijack is possible!
       * TODO: can we overvome this flow somehow? */
      request.options = agregate.addTransaction(requestInfo.address, requestInfo.port, request.transactionID);

      var n = request.optionsCount;

      while (0 < n--) {

        var option = {
          start: 1,
          type: (request.payload[0] >>> 4),
          length: (request.payload[0] & 0x0F)
        };

        if (option.length === 15) {
          console.log('Got a longer option ...');
          option.length += request.payload[option.start++];
        }
        option.end = option.start + option.length;

        agregate.appendOption(request.options, option.type,
            request.payload.slice(option.start, option.end),
            stack.OptionsTable);

        request.payload = request.payload.slice(option.end);
      }
      stack.EventEmitter.emit('request', request); // Perhaps we should emit instead :)
    },
    addTransaction: function (source, port, transactionID) {

      // TODO:
      // * size?
      // * retrans?
      // * timestamps?
      if (!agregate.container.hasOwnProperty(source)) {
        agregate.container[source] = { };
      }
      if (!agregate.container[source].hasOwnProperty(port)) {
        agregate.container[source][port] = { };
      }
      if (!agregate.container[source][port].hasOwnProperty(transactionID)) {
        agregate.container[source][port][transactionID] = { };
      }

      return agregate.container[source][port][transactionID]; // just a shortcut
    },
    appendOption: function (optionsContainer, option, code, OptionsTable) {

      /* We probably don't want to create a global state
       * variable really, so store the options here and
       * may be we could actually forget them depending
       * on `Max-Age` by doing this:
       * setTimout(function forget () {
       *   COAP.Hooks.AgregatorForgotten(container[source][transaction]);
       *   container[source][transaction] = { };
       * }, OptionsTable['Max-Age']*1000);
       */

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
            optionsContainer[OptionsTable.getName(option)] = [data];
          } else {
            optionsContainer[OptionsTable.getName(option)].push(data);
          }
        } else {
          optionsContainer[OptionsTable.getName(option)] = data;
        }
      } else { throw new Error("COAP Option "+option+" is not defined!"); }
      if (hooks.debug) {
        hooks.debug('agregate.container = ',
            agregate.container);
        hooks.debug('agregate.container[source][port][transaction] = ',
            optionsContainer);
      }
    }
  }

  return agregate.parse; } );
