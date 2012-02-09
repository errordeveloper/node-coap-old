// 5.10.  Option Definitions (Draft 08)

module.exports = new function () {

  var opt = {

/* http -> coap =
  * {
  *        'Content-Type'  : 'CONTENT_TYPE',
  *        'Max-Age'       : 'MAX_AGE',
  *        'Proxy-Uri'     : 'PROXY_URI',
  *        'ETag'          : 'ETAG',
  *        'Uri-Host'      : 'URI_HOST',
  *        'Location-Path' : 'LOCATION_PATH',
  *        'Uri-Port'      : 'URI_PORT',
  *        'Location-Query': 'LOCATION_QUERY',
  *        'Uri-Path'      : 'URI_PATH',
  *        'Token'         : 'TOKEN',
  *        'Accept'        : 'ACCEPT',
  *        'If-Match'      : 'MATCH',
  *        'Uri-Query'     : 'URI_QUERY',
  *        'If-None-Match' : 'NONE_MATCH'
} */

    arry: [
      /*  0 */[ /* no-op */ ],
      /*  1 */[true,    'CONTENT_TYPE', 'Content Type', 'usigned', 0, 2, ],
      /*  2 */[false,   'MAX_AGE', 'Maximum Age', 'unsigned', 0, 4, 60],
      /*  3 */[true,    'PROXY_URI', 'Proxy URI', 'string', 1, 270, ],
      /*  4 */[false,   'ETAG', 'Etag', 'opaque', 1, 8, ],
      /*  5 */[true,    'URI_HOST', 'URI Host', 'string', 1, 270, 'localhost' ],
      /*  6 */[false,   'LOCATION_PATH', 'Location Path', 'string', 1, 270, ],
      /*  7 */[true,    'URI_PORT', 'URI Port', 'uint', 0, 2, ],
      /*  9 */[false,   'LOCATION_QUERY', 'Location Query', 'string', 1, 270, ],
      /*  8 */[true,    'URI_PATH', 'URI Path', 'string', 1, 270, ],
      /* 10 */[ /* reserved */ ],
      /* 11 */[true,    'TOKEN', 'Token', 'opaque', 1, 8, ],
      /* 12 */[false,   'ACCEPT', 'Accept', 'uint', 0, 2, ],
      /* 13 */[true,    'MATCH', 'If Match', 'opaque', 1, 270, ],
      /* 14 */[ /* reserved */ ],
      /* 15 */[true,    'URI_QUERY', 'URI Query', 'string', 1, 270, ]
      /* 16 - 20 */ [], [], [], [], [], /* reserved */
      /* 21 */[true,    'NONE_MATCH', 'If None Match', , 0, , ] //TODO: check?
    ],
    desc: { // almost direct implementation of Table 1
      isCritical:       function(n) { return opt.arry[n][0]; },
      //XXX: would this be kindda optimized and how can I check?
      isCriticalAlt:    function(n) { return n%2 ? true : false; },
      shortName:        function(n) { return opt.arry[n][1]; },
      longName:         function(n) { return opt.arry[n][2]; },
      dataType:         function(n) { return opt.arry[n][3]; },
      minLenght:        function(n) { return opt.arry[n][4]; },
      maxLength:        function(n) { return opt.arry[n][5]; },
      defaultValue:     function(n) { return opt.arry[n][6]; },
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
