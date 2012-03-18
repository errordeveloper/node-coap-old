module.exports = (function (hooks) {

  /*
  function getType(c) {
    switch (((c) >> 5) & 0xFF) {
      case 6: // 2xx
        return {
          error: false,
          isResponse: true
        }
      case 12: // 4xx
        return {
          error: true,
          isResponse: true
        }
      case 15: // 5xx
        return {
          error: true,
          isResponse: true
        }
    }
  }
  */

  var headers = {
    //parseCode: function (code) {
      // 11.1.  CoAP Code Registry (Draft 09)
      // 11.1.1.  Method Codes (Draft 09)
      //var methods = [ 'EMPTY', 'GET', 'POST', 'PUT', 'DELETE' ];
      //var reponse = function (name, error) {
      //  return { isEmpty: false, isRequest: false, isResponse: true,
      //    error: error, verb: name };
      //};
      //
      //if (typeof code === 'number') {
      //  if (code === 0) {
      //  /* 0         Indicates an empty message (see Section 4.4). */
      //    if (hooks.stats) { hook.stats('rx_'+methods[code], 1); }
      //    return { isEmpty: true, isResponse: true, isRequest: false,
      //      error: false, verb: methods[code] };
      //  } else if (code >= 1 && 31 >= code) {
      //  /* 1-31      Indicates a request.  Values in this range are assigned by
      //   *           the "CoAP Method Codes" sub-registry (see Section 11.1.1).
      //   * [11.1.1.  Method Codes (Draft 09), Table 2] */
      //   if (hooks.stats) { hook.stats('rx_'+methods[code], 1); }
      //   return { isEmpty: false, isResponse: false, isRequest: true,
      //     error: false, verb: methods[code] };
      //  } else if (code >= 64 && 191 >= code) {
      //  /* 64-191    Indicates a response.  Values in this range are assigned by
      //   *           the "CoAP Response Codes" sub-registry (see Section 11.1.2).
      //   * [11.1.2.  Response Codes (Draft 09), Table 3] */
      //    switch(code) {
      //      case 65:
      //        return response('2.01 Created', false);
      //      case 66:
      //        return response('2.02 Deleted', false);
      //      case 67:
      //        return response('2.04 Changed', false);
      //      case 68:
      //        /* return response('...'); */
      //
      //  } else { /* 32-63, 192-255   Reserved */
      //    throw new Error('Reserved request code recieved!');
      //  }
      //} else if (typeof code === 'string') {
      //} else {
      //  throw new Error('Malformed request code!');
      //}

    decode: function (e) { return (((e)/32 >>> 0)*100 | (e)%32); },
    decodeTypes: [ 'CON', 'NON', 'ACK', 'RST' ],
    decoder: function (buffer, info) { return {
      origin: info,
      // first byte: version, type, and option count
      protocolVersion:
         ((buffer[0] & 0xC0) >>> 6),
      connectionType:
        headers.decodeTypes[((buffer[0] & 0x30) >>> 4)],
      optionsCount:
        (buffer[0] & 0x0F),
      // second byte: method or response code
      requestCode:
        headers.decode(buffer[1]),
      // third and forth byte: transaction ID (TID)
      transactionID:
        ((buffer[2] << 8) | buffer[3]),
      payload: buffer.slice(4),
    }; },
    //encodeCodes: {
    //  /* 0         Indicates an empty message (see Section 4.4).
    //   */ 'EMPTY': 0,
    //  /* 1-31      Indicates a request.  Values in this range are assigned by
    //   *           the "CoAP Method Codes" sub-registry (see Section 11.1.1).
    //   * [11.1.1.  Method Codes (Draft 09), Table 2]
    //   */ 'GET':1, 'POST':2, 'PUT':3, 'DELETE':4,
    //  /* 32-63     Reserved */
    //  /* 64-191    Indicates a response.  Values in this range are assigned by
    //   *           the "CoAP Response Codes" sub-registry (see Section 11.1.2).
    //   * [11.1.2.  Response Codes (Draft 09), Table 3]
    //   */ '2.01':65, '2.02':66, '2.03':67, '2.04':68, '2.05':69,
    //      '4.00':128, '4.01':129, '4.02':130, '4.03':131, '4.04':132,
    //      '4.05':133, '4.06':134, '4.12':140, '4.13':141, '4.15':143,
    //      '5.00':160, '5.01':161, '5.02':162, '5.03':163, '5.04':164,
    //      '5.05':165,
    //  /* 192-255   Reserved */
    //},
    encode: function (e) { return (((e)/100 << 5) | (e)%100); },
    encodeTypes: { 'CON':0, 'NON':1, 'ACK':2, 'RST':3 },
    encoder: function (request) {
      // BEWARE:
      // The upper layer should provide us a consistent request.
      // * It _does not_ check for properties in the request!
      // first byte: version, type, and option count
      request.payload[0] = 0x00;
      request.payload[0] |= (0x0F & (request.optionsCount));
      request.payload[0] |= (0xC0 & (request.protocolVersion << 6));
      request.payload[0] |= (0x30 & (request.connectionType << 4));
      // second byte: request method or response code
      request.payload[1] = headers.encode(request.code);
      // third and forth byte: transaction ID (TID)
      request.payload[2] = (0xFF & (request.transactionID >> 8));
      request.payload[3] = (0xFF & (request.transactionID));
      // We return from here, so that can be passed to `dgram.send()`
      return request.payload; }
  };
    
  return { encode: headers.encoder, decode: headers.decoder }; } );
