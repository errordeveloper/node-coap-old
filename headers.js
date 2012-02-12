module.exports = (function (debugHook) {

  var headers = {
    table: {
      Methods: [ , 'GET', 'POST', 'PUT', 'DELETE' ],
      Types: [ 'CON', 'NON', 'ACK', 'RST' ],
    },

    getters: {
      parse: function (buffer) { return {
        // first byte: version, type, and option count
        protocolVersion:
           ((buffer[0] & 0xC0) >>> 6),
        connectionType:
          headers.table.Types[((buffer[0] & 0x30) >>> 4)],
        optionsCount:
          (buffer[0] &0x0F),
        // second byte: method or response code
        requestCode:
          headers.table.Methods[(buffer[1])],
        // third and forth byte: transaction ID (TID)
        transactionID:
          ((buffer[2] << 8) | buffer[3]),
        payload: buffer.slice(4),
      }; }
    }
  }
    
  return headers.getters; } () );
