module.exports = ( function (stack, hooks) {

  var uint = require ('./buffers'); //XXX: does it need to be in `COAP.stack`?

  var agregate = {

    encoder: function (request, callback) {
      callback(stack.ParseHeaders.encode(request));
    },
    decoder: function (messageBuffer, requestInfo) {

      var request = stack.ParseHeaders.decode(messageBuffer, requestInfo);

      request.options = {};

      if (hooks.stats) { hooks.stats('messages', 1); }
      if (hooks.stats) { hooks.stats('total_rx', requestInfo.size); }
      if (hooks.debug) { hooks.debug('request.options = ', request.options); }

      var n = request.optionsCount;

      var option = {type: 0};
      while (0 < n--) {

        option.start = 1;
        option.type += (request.payload[0] >>> 4);
        option.length = (request.payload[0] & 0x0F);

        if (option.length === 0x0F) {
          option.length += request.payload[option.start++];
        }

        option.end = option.start + option.length;

        if (hooks.debug) { hooks.debug('option = ', option); }

        agregate.appendOption(request.options, option.type,
            request.payload.slice(option.start, option.end),
            option.length, stack.OptionsTable.decode);

        request.payload = request.payload.slice(option.end);
      }
      stack.EventEmitter.emit('request', request);
    },
    appendOption: function (requestOptions, option, code, length, OptionsTable) {

      var data;

      switch (OptionsTable.dataType(option)) {
        case 'uint':
          if (length === 0) {
            data = 0;
          } else if (length > 4 || length < 0) {
            throw new Error("Unknow integer length ("+length+") for Option "+option+"!");
          } else {
            data = uint.read[length](code, 0);
          }
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
          if (!requestOptions.hasOwnProperty(OptionsTable.getName(option))) {
            requestOptions[OptionsTable.getName(option)] = [data];
          } else {
            requestOptions[OptionsTable.getName(option)].push(data);
          }
        } else {
          requestOptions[OptionsTable.getName(option)] = data;
        }
      } else { throw new Error("COAP Option "+option+" is not defined!"); }
      if (hooks.debug) { hooks.debug('requestOptions = ', requestOptions); }
    }
  };

  return { encode: agregate.encoder, decode: agregate.decoder }; } );
