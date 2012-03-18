module.exports = (function () {
  /* We keep it low-level here, only the message type
   * is parsed to string format (it's easy anyway)!
   * The idea is to have this as "a model" and put no
   * behavioural characteristics in here, because we
   * shall define that in "the controller". */

  var headers = {
    decodeMessageCodes: function (c) {
      return (((c) >> 5)*100 | (c)%32);
    },
    decodeMessageTypes: [ 'CON', 'NON', 'ACK', 'RST' ],
    decoder: function (buffer, info) { return {
      origin: info,
      // first ocet: version, type, and option count
      protocolVersion:
         ((buffer[0] & 0xC0) >>> 6),
      messageType:
        headers.decodeMessageTypes[((buffer[0] & 0x30) >>> 4)],
      optionsCount:
        (buffer[0] & 0x0F),
      // second ocet: request method or response code
      messageCode:
        headers.decodeMessageCodes(buffer[1]),
      // third and forth ocet: message ID (MID)
      messageID:
        ((buffer[2] << 8) | buffer[3]),
      payload: buffer.slice(4),
    }; },
    encodeMessageCodes: function (c) {
      return (((c)/100 << 5) | (c)%100);
    },
    encodeMessageTypes: { 'CON':0, 'NON':1, 'ACK':2, 'RST':3 },
    encoder: function (message) {
      // first ocet: version, type, and option count
      message.payload[0] = 0x00;
      message.payload[0] |= (0x0F & (message.optionsCount));
      message.payload[0] |= (0xC0 & (message.protocolVersion << 6));
      message.payload[0] |= (0x30 & (headers.encodeMessageTypes[message.messageType] << 4));
      // second ocet: request method or response code
      message.payload[1] = headers.encodeMessageCodes(message.messageCode);
      // third and forth ocet: message ID (MID)
      message.payload[2] = (0xFF & (message.messageID >> 8));
      message.payload[3] = (0xFF & (message.messageID));
      // We return from here, so that can be passed to `dgram.send()`
      return message.payload; }
  };
    
  return { encode: headers.encoder, decode: headers.decoder }; } () );
