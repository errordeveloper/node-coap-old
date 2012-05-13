module.exports = ( function Helpers () {

  var helpers = {
    uri: function MakeURI (path) {
      // TODO: make it somewhat similar to `uri` module
      return {
       'Uri-Path': path.split('/')
      };
    }
  };

  return { MakeURI: helpers.uri }; } () );
