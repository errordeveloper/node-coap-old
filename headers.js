module.exports = (function () {

  var headers = {
    decodeMethods: [ , 'GET', 'POST', 'PUT', 'DELETE' ],
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
        headers.decodeMethods[(buffer[1])],
      // third and forth byte: transaction ID (TID)
      transactionID:
        ((buffer[2] << 8) | buffer[3]),
      payload: buffer.slice(4),
    }; },
    encodeMethods: { 'GET':1, 'POST':2, 'PUT':3, 'DELETE':4 },
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
      // second byte: method or response code
      request.payload[1] = headers.encodeMethods[request.requestCode];
      // third and forth byte: transaction ID (TID)
      request.payload[2] = (0xFF & (request.transactionID >> 8));
      request.payload[3] = (0xFF & (request.transactionID));

      return request.payload; }
  };
    
  return { encode: headers.encoder, decode: headers.decoder }; } () );
