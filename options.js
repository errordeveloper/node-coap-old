// 5.10.  Option Definitions (Draft 08)

module.exports = new function () {

  var opt = {

    arry: [
      /*  0 */[ /* no-op */ ],
      /*  1 */[true,    'Content-Type', 'usigned', 0, 2, ],
      /*  2 */[false,   'Max-Age', 'unsigned', 0, 4, 60],
      /*  3 */[true,    'Proxy-Uri', 'string', 1, 270, ],
      /*  4 */[false,   'ETag', 'opaque', 1, 8, ],
      /*  5 */[true,    'Uri-Host', 'string', 1, 270, 'localhost' ],
      /*  6 */[false,   'Location-Path', 'string', 1, 270, ],
      /*  7 */[true,    'Uri-Port', 'uint', 0, 2, ],
      /*  9 */[false,   'Location-Query', 'string', 1, 270, ],
      /*  8 */[true,    'Uri-Path', 'string', 1, 270, ],
      /* 10 */[ /* reserved */ ],
      /* 11 */[true,    'Token', 'opaque', 1, 8, ],
      /* 12 */[false,   'Accept', 'uint', 0, 2, ],
      /* 13 */[true,    'If-Match', 'opaque', 1, 270, ],
      /* 14 */[ /* reserved */ ],
      /* 15 */[true,    'Uri-Query', 'string', 1, 270, ]
      /* 16 - 20 */ [], [], [], [], [], /* reserved */
      /* 21 */[true,    'If-None-Match', , 0, , ] //TODO: check?
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
      lookup: {}
    },
  }

  //if (withHash) { //XXX: are there cases where one won't need it?
    for (var o in opt.arry) {
      if (opt.arry[o][1]) {
        opt.desc.lookup[opt.arry[o][1]]=o;
        /* XXX: also, do we need this at all:
         * opt.desc.fancy[opt.arry[o][2]]= {
         * number: o,
         * ...
         * cause that will require a whole
         * bunch of nested loops etc ...
         */
      }
    }
  //}

  return opt.desc;
}
