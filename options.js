// 5.10.  Option Definitions (Draft 08)

module.exports = new function () {

  var opt = {

    arry: [
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
      /* 10 */[ /* reserved */ ],
      /* 11 */[true,    'Token', 'opaque', 1, 8, ,             false],
      /* 12 */[false,   'Accept', 'uint', 0, 2, ,               true],
      /* 13 */[true,    'If-Match', 'opaque', 1, 270, ,         true],
      /* 14 */[ /* reserved */ ],
      /* 15 */[true,    'Uri-Query', 'string', 1, 270, ,        true],
      /* 16 - 20 */ [], [], [], [], [], /* reserved */
      /* 21 */[true,    'If-None-Match', , 0, , , /* check? */ false]
    ],
    desc: { // almost direct implementation of Table 1
      isCritical:       function(n) { return opt.arry[n][0]; },
      //XXX: would this be kindda optimized and how can I check?
      isCriticalAlt:    function(n) { return n%2 ? true : false; },
      optionName:       function(n) { return opt.arry[n][1]; },
      dataType:         function(n) { return opt.arry[n][2]; },
      minLenght:        function(n) { return opt.arry[n][3]; },
      maxLength:        function(n) { return opt.arry[n][4]; },
      defaultValue:     function(n) { return opt.arry[n][5]; },
      allowMultiple:    function(n) { return opt.arry[n][6]; },
      isDefined:        function(n)
      {
        if (n in opt.arry) {
          if (opt.arry[n][0] || !opt.arry[n][0]) {
            return true;
          } else { return false; }
        } else { return false; }
      },
      template: function() { return opt.template; },
      lookup: {}
    },
    template: {}
  }

  for (var o in opt.arry) {
    if (opt.arry[o][1]) {
      opt.desc.lookup[opt.arry[o][1]]=o;
    }
    if (opt.arry[o][6]) {
      opt.template[opt.arry[o][1]]=[];
    } else {
      switch (opt.desc.dataType) {
        case 'uint':
          opt.template[opt.arry[o][1]] = opt.arry[o][5] || 0;
          break;
        default:
          opt.template[opt.arry[o][1]] = opt.arry[o][5] || "";
          break;
      }
  }

  return opt.desc;
}
