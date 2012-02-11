// 5.10.  optionsion table (Draft 08)

module.exports = ( function () {

  var options = {

    table: [
      /*  0 */[ /* no-op */ ],
      /*  1 */[true,    'Content-Type', 'usigned', 0, 2, ,     false],
      /*  2 */[false,   'Max-Age', 'unsigned', 0, 4, 60,       false],
      /*  3 */[true,    'Proxy-Uri', 'string', 1, 270, ,        true],
      /*  4 */[false,   'ETag', 'opaque', 1, 8, ,              false],
      /*  5 */[true,    'Uri-Host', 'string', 1, 270, ,        false],
      /*  6 */[false,   'Location-Path', 'string', 1, 270, ,    true],
      /*  7 */[true,    'Uri-Port', 'uint', 0, 2, 5683,        false],
      /*  9 */[false,   'Location-Query', 'string', 1, 270, ,   true],
      /*  8 */[true,    'Uri-Path', 'string', 1, 270, ,         true],
      /* 10 */[false,   'Observe', 'uint', 0, 2, , ], ///Check!!!
      /* 11 */[true,    'Token', 'opaque', 1, 8, ,             false],
      /* 12 */[false,   'Accept', 'uint', 0, 2, ,               true],
      /* 13 */[true,    'If-Match', 'opaque', 1, 270, ,         true],
      /* 14 */[/* false,   'Fence-Port', 0, , , , */], //Check!!!
      /* 15 */[true,    'Uri-Query', 'string', 1, 270, ,        true],
      /* 16 - 20 */ [], [], [], [], [], /* reserved */
      /* 21 */[true,    'If-None-Match', , 0, , , /* check? */ false]
    ],

    getters: { // almost direct implementation of Table 1
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
          if (options.table[n][0] || !options.table[n][0]) {
            return true;
          } else { return false; }
        } else { return false; }
      },
      byName: {}
    }
  }

  for (var n in options.table) {
    if (options.table[n][1]) {
      options.getters.byName[options.table[n][1]]=n;
    }
  }

  return options.getters; } () );
