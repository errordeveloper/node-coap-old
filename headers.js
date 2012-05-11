// 3.1.  Message Format (Draft 09)

module.exports = ( function ParseHeaders () {
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
      // first octet: version, type, and option count
      protocolVersion:
         ((buffer[0] & 0xC0) >>> 6),
      messageType:
        headers.decodeMessageTypes[((buffer[0] & 0x30) >>> 4)],
      optionsCount:
        (buffer[0] & 0x0F),
      // second octet: request method or response code
      messageCode:
        headers.decodeMessageCodes(buffer[1]),
      // third and forth octet: message ID (MID)
      messageID:
        ((buffer[2] << 8) | buffer[3]),
      payload: buffer.slice(4),
    }; },
    encodeMessageCodes: function (c) {
      return (((c)/100 << 5) | (c)%100);
    },
    encodeMessageTypes: { 'CON':0, 'NON':1, 'ACK':2, 'RST':3 },
    encoder: function (message) {
      with (message) {
        // first octet: version, type, and option count
        payload[0] = 0x00;
        payload[0] |= (0x0F & (optionsCount));
        payload[0] |= (0xC0 & (protocolVersion << 6));
        payload[0] |= (0x30 & (headers.encodeMessageTypes[messageType] << 4));
        // second octet: request method or response code
        payload[1] = headers.encodeMessageCodes(messageCode);
        // third and forth octet: message ID (MID)
        payload[2] = (0xFF & (messageID >> 8));
        payload[3] = (0xFF & (messageID));
        // We need to drop the tail of the pre-allocated buffer
        // when it is not in use, i.e. doing a GET or a DELETE
        if (messageCode === 'GET' || messageCode === 'DELETE') {
          payload = payload.slice(0, optionsLength+2);
        }
      }
      // We return from here, so that can be passed to `dgram.send()`
      return message.payload; }
  };
    
  return { encode: headers.encoder, decode: headers.decoder }; } () );
