module.exports = ( function (stack, hooks) {

  var agregate = {

    container: {},
    /* TODO: get rid of permanent container and any
     * internal state, all that has to go elsewhere! */

    encoder: function () {
    },
    decoder: function (messageBuffer, requestInfo) {

      var request = stack.ParseHeaders.decode(messageBuffer, requestInfo);

      request.options = agregate.addTransaction(requestInfo.address, requestInfo.port, request.transactionID);

      var n = request.optionsCount;

      var option = {type: 0};
      while (0 < n--) {

        option.start = 1;
        option.type += (request.payload[0] >>> 4);
        option.length = (request.payload[0] & 0x0F);

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
