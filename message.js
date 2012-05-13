// 3.1.  Message Format (Draft 09)
// 3.2.  Option Format (Draft 09)

module.exports = ( function ParseMessage (stack, hooks) {
  /* This the toplevel message parser, it ustilises the
   * `OptionsTable` and `ParseHeaders` models to translate
   * between objects and binary encoded packets. It does
   * implement more logic and recursion the above models,
   * but still is rather low-level and does not implement
   * any behaviour of a CoAP endpoint. */

  var message = {

    encoder: function (tx, callnext) {

      tx.optionsCount = 0;
      tx.options.byNumber = [];

      /* Let's do all this array manipulations one by one for now - optimize later! */
      for (var option in tx.options) {
        if (tx.options.hasOwnProperty(option) &&
            stack.OptionsTable.encode.isDefined(option)) {
          tx.options.byNumber[stack.OptionsTable.encode.getNumber(option)] = tx.options[option];
        }
      }

      /* An option was not specified - apply default value (if defined) */
      /* NOTE: this will not work if `tx.options` is empty! */
      for (var option = 1; option <= tx.options.byNumber.length; option++) {
        if (tx.options.byNumber[option] === undefined &&
            stack.OptionsTable.decode.defaultValue(option) !== undefined) {
          tx.options.byNumber[option] = stack.OptionsTable.decode.defaultValue(option);
        }
      }

      /* To keep it simple we just allocate the maximum suggested by the RFC. */
      tx.payload = new Buffer(1152);

      var n = 4, // Offset
          d = 0, // Delta
          p = 0; // Previous

      /* Iterate over sorted options */
      for (var option in tx.options.byNumber) {
        if (!stack.OptionsTable.decode.allowMultiple(option)) {
          d = option - p; p = option;
          n = message.setOption(tx.payload, n, option, d, tx.options.byNumber[option]);
          tx.optionsCount++;
          //console.log('n:'+n);
        } else if (stack.OptionsTable.decode.allowMultiple(option) &&
            tx.options.byNumber[option].constructor === Array) {
          for (var subopt in tx.options.byNumber[option]) {
            d = option - p; p = option;
            n = message.setOption(tx.payload, n, option, d, tx.options.byNumber[option][subopt]);
            tx.optionsCount++;
            //console.log('n:'+n);
          }
        } else {
          //FIXME: currently the options which are allowed as multiple are not allowed as single values!
          throw new Error("Malformed option in the `tx` object!");
        }
      }
      // XXX: it is not cleare whether it's used wrongly here, or even
      // Wireshark doesn't know about the magic end-of-options marker?
      // tx.optionsLength = message.setEndMarker(tx.payload, n);
      tx.optionsLength = n;

      if (hooks.debug) { hooks.debug('tx = ', tx); }

      callnext(stack.ParseHeaders.encode(tx));
    },
    decoder: function (datagram, info, callback) {

      var rx = stack.ParseHeaders.decode(datagram, info);

      rx.options = {};


      var n = rx.optionsCount;

      var option = {type: 0};
      while (0 < --n) {
        if (hooks.debug) { hooks.debug('optionsRemaining = ', n); }
        option.start = 1;
        option.type += (rx.payload[0] >>> 4);
        option.length = (rx.payload[0] & 0x0F);

        if (option.length === 0x0F) {
          option.length += rx.payload[option.start++];
        }

        option.end = option.start + option.length;

        if (hooks.debug) { hooks.debug('option = ', option); }

        message.appendOption(rx.options, option.type,
            rx.payload.slice(option.start, option.end),
            option.length, stack.OptionsTable.decode);

        rx.payload = rx.payload.slice(option.end);
      }

      if (hooks.stats) { hooks.stats('rx_count', 1); }
      //FIXME: In Wireshark, it looks like our stats are wrong!
      //if (hooks.stats) { hooks.stats('rx_bytes', info.size); }
      if (hooks.debug) { hooks.debug('rx = ', rx); }

      stack.EventEmitter.emit('message', rx);
      if (typeof callback === 'function') { callback(rx); }
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
        throw new Error("Malformed option (of type `object`) detected in the `tx` object!");
      } else if (data.constructor === String) {
        var length = Buffer.byteLength(data);
        offset += message.setOptionHeader(buffer, offset, delta, length);
        //console.log('n:'+offset+' (wrote string header, length='+length+')');
        offset += buffer.write(data, offset);
        //console.log('n:'+offset+' (wrote the string, length='+length+')');
        return offset;
      } else if (data.constructor === Number) {
        /* Using `maxLength` of the given option is the best decition. */
        var length = stack.OptionsTable.decode.maxLength(option);
        offset += message.setOptionHeader(buffer, offset, delta, length);
        //console.log('n:'+offset+' (wrote number header, length='+length+')');
        offset += stack.IntegerUtils.write[length](buffer, offset, data);
        //console.log('n:'+offset+' (wrote the number)');
        return offset;
      } else {
        throw new Error("Unidentified option in the `tx` object!");
      }
    },
    setEndMarker: function (buffer, offset) {
      buffer[offset] = 0xF0; //= (0x0F & 0) | (0xF0 & 15 << 4);
      buffer[offset++] = 0xF0;
      return offset;
    },
    appendOption: function (rxOptions, option, code, length, OptionsTable) {

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
          if (!rxOptions.hasOwnProperty(OptionsTable.getName(option))) {
            rxOptions[OptionsTable.getName(option)] = [data];
          } else {
            rxOptions[OptionsTable.getName(option)].push(data);
          }
        } else {
          rxOptions[OptionsTable.getName(option)] = data;
        }
      } else { throw new Error("COAP Option "+option+" is not defined!"); }
      if (hooks.debug) { hooks.debug('rxOptions = ', rxOptions); }
    }
  };

  return { encode: message.encoder, decode: message.decoder }; } );
