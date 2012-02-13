// 5.10. Options (Draft 08)

module.exports = ( function () {

  var options = {

    table: [
      /*  0 */[ /* no-op */ ],
      /*  1 */[true,    'Content-Type', 'uint', 0, 2, ,        false],
      /*  2 */[false,   'Max-Age', 'uint', 0, 4, 60,           false],
      /*  3 */[true,    'Proxy-Uri', 'string', 1, 270, ,        true],
      /*  4 */[false,   'ETag', 'opaque', 1, 8, ,              false],
      /*  5 */[true,    'Uri-Host', 'string', 1, 270, ,        false],
      /*  6 */[false,   'Location-Path', 'string', 1, 270, ,    true],
      /*  7 */[true,    'Uri-Port', 'uint', 0, 2, 5683,        false],
      /*  9 */[false,   'Location-Query', 'string', 1, 270, ,   true],
      /*  8 */[true,    'Uri-Path', 'string', 1, 270, ,         true],
      /* 10 */[false,   'Observe', 'uint', 0, 2, , undefined], ///Check!!!
      /* 11 */[true,    'Token', 'opaque', 1, 8, ,             false],
      /* 12 */[false,   'Accept', 'uint', 0, 2, ,               true],
      /* 13 */[true,    'If-Match', 'opaque', 1, 270, ,         true],
      /* 14 */[/* false,   'Fence-Port', 0, , , , */], //Check!!!
      /* 15 */[true,    'Uri-Query', 'string', 1, 270, ,        true],
      /* 16 - 20 */ [], [], [], [], [], /* reserved */
      /* 21 */[true,    'If-None-Match', , 0, , , /* check? */ false]
    ],

    decoder: { // almost direct implementation of Table 1
      isCritical:       function(n) { return options.table[n][0]; },
      //XXX: would this be kindda optionsimized and how can I check?
      isCriticalAlt:    function(n) { return n%2 ? true : false; },
      getName:          function(n) { return options.table[n][1]; },
      dataType:         function(n) { return options.table[n][2]; },
      minLenght:        function(n) { return options.table[n][3]; },
      maxLength:        function(n) { return options.table[n][4]; },
      defaultValue:     function(n) { return options.table[n][5]; },
      allowMultiple:    function(n) { return options.table[n][6]; },
      isDefined:        function(n)
      {
        if (n in options.table) {
          console.log('options.table['+n+'].length: '+options.table[n].length);
          if (options.table[n].length === 7) {
            return true;
          } else { return false; }
        } else { return false; }
      },
    },
    encoder: {
      isCritical:       function (optionName) { return options.encoder[optionName][0]; },
      //XXX: `getName` is 999% pointless here! However, `getNumber` is good for testing.
      getNumber:        function (optionName) { return options.options[optionName]; },
      dataType:         function (optionName) { return options.encoder[optionName][2]; },
      minLenght:        function (optionName) { return options.encoder[optionName][3]; },
      maxLenght:        function (optionName) { return options.encoder[optionName][4]; },
      defaultValue:     function (optionName) { return options.encoder[optionName][5]; },
      allowMultiple:    function (optionName) { return options.encoder[optionName][6]; },
      //XXX: that's probably redundant, but for the completnes sake!
      isDefined:        function (optionName)
      {
        return options.encoder.hasOwnProperty(optionName);
      }
    },
    options: {} // this used to store the map for `getNumber`
  };

  // build reverse mapping table for encoding
  for (var n in options.table) {
    if (options.table[n][1]) {
      options.encoder[options.table[n][1]]=options.table[n];
      options.options[options.table[n][1]]=n;
    }
  }

  return { encode: options.encoder, decode: options.decoder }; } () );
