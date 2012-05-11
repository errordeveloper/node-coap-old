module.exports = ( function Helpers (stack, hooks, dgram) {

  /* This is very rought, needs some major re-work! */

  var helpers = {
    createSocket: function (type) {
      var socket = dgram.createSocket(type);
      return {
        send: function Sender (message, callback) {
          stack.ParseMessage.encode(message, function (buffer) {
            with (message) {
              socket.send(payload, 0, payload.length, origin.port, origin.address, callback);
            }
          });
        }
      };
    },
    // parse method/response codes and uri into internal representation
    newMessage: function (code, uri) {
      var message = {
        //origin: {address: '::1', port: 5683},
        protocolVersion: 1,
        //messageType: 'CON',
        //messageID: 2400239,
        messageCode: 0,
        options: { }
      };
      var methods = [ undefined, 'GET', 'POST', 'PUT', 'DELETE' ]
      switch (typeof code) {
        case 'number':
          message.code = code;
          break;
        case 'string':
          if (methods.indexOf(code) >= -1) {
            message.code = methods.indexOf(code);
            break;
          } // otherwise fall-through and throw
        default:
          throw new Error('Wrong argument type for `code`!');
      }
      return message;
    }
  };

  return { createSocket: helpers.createSocket, newMessage: helpers.newMessage }; } );
