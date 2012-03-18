// 11.3.  Media Type Registry (Draft 08)

module.exports = ( function ContentTypes () {
  /* ... Currently it is unreasonable to make this
   * as an array - we only have a few things here. */

  var content = {
    encoder: function (contentType) {
      switch (contentType) {
        case 'text/plain':                return (0x00);
        case 'application/link-format':   return (0x28);
        case 'application/xml':           return (0x29);
        case 'application/octet-stream':  return (0x2a);
        case 'application/exi':           return (0x2f);
        case 'application/json':          return (0x32);
        default: //XXX: is this no to bad thing to do?
          return (typeof contentType === 'number')
              ? (contentType) : (0x2a);
      }
    },
    decoder: function (contentType) {
      switch (contentType) {
        case 0x00:  return ('text/plain');
        case 0x28:  return ('application/link-format');
        case 0x29:  return ('application/xml');
        case 0x2a:  return ('application/octet');
        case 0x2f:  return ('application/exi');
        case 0x32:  return ('application/json');
          default: //XXX: and here?
          return ('application/octet');

      }
    }
  }

  return { encode: content.encoder, decode: content.decoder } () );
