module.exports = (function () {

   var impl = {
     optNumbers:[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 21
     ],
     optNames:[
       'Content-Type', 'Max-Age', 'Proxy-Uri', 'ETag', 'Token', 'Observe',
       'Uri-Host', 'Uri-Port', 'Uri-Path', 'Location-Path', 'Location-Query',
       'If-Match', 'If-None-Match', 'Accept'
     ]
   };

   if (impl.optNumbers.length !== impl.optNumbers.length) {
     throw new Error('Unit test code is invalid!');
   }

   exports = { 
     randomOptionNumber: function ()
     {
       return impl.optNumbers[parseInt(Math.random()*100, 10) % impl.optNumbers.length];
     },
     randomOptionName: function ()
     {
      return impl.optNames[parseInt(Math.random()*100, 10) % impl.optNames.length];
     }
   }

   return exports; } () );
