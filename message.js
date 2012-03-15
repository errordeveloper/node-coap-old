module.exports = ( function (stack, hooks) {

  var agregate = {

    encoder: function (request, callback) {

      request.optionsCount = 0;
      request.options.byNumber = [];

      /* Let's do all this array manipulations one by one for now - optimize later! */
      for (var option in request.options) {
        if (request.options.hasOwnProperty(option) &&
            stack.OptionsTable.encode.isDefined(option)) {
          request.options.byNumber[stack.OptionsTable.encode.getNumber(option)] = request.options[option];
        }
      }

      /* An option was not specified - apply default value (if defined) */
      //for (var option = 1; option <= request.options.byNumber.length; option++) {
      //  if (request.options.byNumber[option] === undefined &&
      //      stack.OptionsTable.decode.defaultValue(option) !== undefined) {
      //    request.options.byNumber[option] = stack.OptionsTable.decode.defaultValue(option);
      //    request.optionsCount++;
      //  }
      //}

      /* To keep it simple we just allocate the maximum suggested by the RFC. */
      request.payload = new Buffer(1152);

      var n = 4, // Offset
          d = 0, // Delta
          p = 0; // Previous

      /* Iterate over sorted options */
      for (var option in request.options.byNumber) {
        if (!stack.OptionsTable.decode.allowMultiple(option)) {
          d = option - p; p = option;
          n = agregate.setOption(request.payload, n, option, d, request.options.byNumber[option]);
          request.optionsCount++;
          //console.log('n:'+n);
        } else if (stack.OptionsTable.decode.allowMultiple(option) &&
            request.options.byNumber[option].constructor === Array) {
          for (var subopt in request.options.byNumber[option]) {
            d = option - p; p = option;
            n = agregate.setOption(request.payload, n, option, d, request.options.byNumber[option][subopt]);
            request.optionsCount++;
            //console.log('n:'+n);
          }
        } else {
          throw new Error("Malformed option in the `request` object!");
        }
      }

      callback(stack.ParseHeaders.encode(request));
    },
    decoder: function (messageBuffer, requestInfo) {

      var request = stack.ParseHeaders.decode(messageBuffer, requestInfo);

      request.options = {};

      if (hooks.stats) { hooks.stats('messages', 1); }
      if (hooks.stats) { hooks.stats('total_rx', requestInfo.size); }
      if (hooks.debug) { hooks.debug('request = ', request); }

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
    setOptionHeader: function (buffer, offset, delta, length) {
      //console.log('In `setOptionHeader`: offset='+offset+', delta='+delta+', length='+length+';');
      if (length < 15) {
        //console.log('Regular Header');
        buffer[offset] = (0x0F & length) | (0xF0 & delta << 4);
        return 1;
      } else {
        //console.log('Extended Header');
        buffer[offset] = 0x0F | (0xF0 & delta << 4);
        buffer[offset+1] = 0xFF & (length - 15);
        return 2;
      }
    },
    setOption: function (buffer, offset, option, delta, data) {
      //console.log('In `setOption`: offset='+offset+', delta='+delta+', data='+data+';');
      if (typeof data === 'object') {
        throw new Error("Malformed option in the `request` object!");
      } else if (data.constructor === String) {
        var length = Buffer.byteLength(data);
        offset += agregate.setOptionHeader(buffer, offset, delta, length);
        //console.log('n:'+offset+' (wrote string header, length='+length+')');
        offset += buffer.write(data, offset);
        //console.log('n:'+offset+' (wrote the string, length='+length+')');
        return offset;
      } else if (data.constructor === Number) {
        /* Using `maxLength` of the given option is the best decition. */
        var length = stack.OptionsTable.decode.maxLength(option);
        offset += agregate.setOptionHeader(buffer, offset, delta, length);
        //console.log('n:'+offset+' (wrote number header, length='+length+')');
        offset += stack.IntegerUtils.write[length](buffer, offset, data);
        //console.log('n:'+offset+' (wrote the number)');
        return offset;
      } else {
        throw new Error("Unidentified option in the `request` object!");
      }
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
            data = stack.IntegerUtils.read[length](code, 0);
          }
          break;
        case 'string':
          data = code.toString(0);
          break;
        case 'opaque':
          data = code.toString(0);
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
