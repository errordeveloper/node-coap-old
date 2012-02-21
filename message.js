module.exports = ( function (stack, hooks) {

  var agregate = {

    container: {},

    encoder: function () {

      /*
      var buffer = [];
      buffer[0] |= type << 4;
      buffer[0] |= length & 0x0F;
      */

    },
    decoder: function (messageBuffer, requestInfo) {

      var request = stack.ParseHeaders.decode(messageBuffer, requestInfo);

      /* Storing by `[IP][TID]` seems natural, however
       * the IPs may change and a hijack is possible!
       * TODO: can we overvome this flow somehow? */
      request.options = agregate.addTransaction(requestInfo.address, requestInfo.port, request.transactionID);

      var n = request.optionsCount;

      var option = {type: 0};
      while (0 < n--) {

        option.start = 1;
        option.type += (request.payload[0] >>> 4);
        option.length = (request.payload[0] & 0x0F);

        if (option.type !== 0) {
          option.delta = option.type;
        } else {
          option.type = option.delta;
        }

        if (option.length === 15) {
          option.length += request.payload[option.start++];
        }
        option.end = option.start + option.length;

        hooks.debug('option = ', option);

        agregate.appendOption(request.options, option.type,
            request.payload.slice(option.start, option.end),
            stack.OptionsTable.decode);

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

      var data;

      switch (OptionsTable.dataType(option)) {
        case 'uint':
          data = code.readUInt8(0);
          break;
        case 'string':
          data = code.toString(0);
          break;
        case 'opaque':
          data = new Buffer(code.length);
          code.copy(data);
          break;
      }

      if (OptionsTable.isDefined(option)) {
        if (OptionsTable.allowMultiple(option)) {
          if (!optionsContainer.hasOwnProperty(OptionsTable.getName(option))) {
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
  };

  return { encode: agregate.encoder, decode: agregate.decoder }; } );
