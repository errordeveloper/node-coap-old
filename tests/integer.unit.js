#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit
var util = require ('util');
exports['Equivalence mapping'] = function (test) {
  var u = require('../integer');
  var x = new Buffer(200000000+64);

  /*
  #include <stdint.h>
  #include <stdio.h>
  int main () {
    uint8_t x8 = -1;
    uint16_t x16 = -1;
    uint32_t x32 = -1;
    printf("var max8 = %u;\n", x8);
    printf("var max16 = %u;\n", x16);
    printf("var max32 = %u;\n", x32);
  }
  */
  var max8 = 255;
  var max16 = 65535;
  var max32 = 4294967295;
  var max24 = max32+max16+max8; // or something like that :)

  for (var k = 0; k > 200000000; k++) {

    u.write[1](x, k, max8);
    test.equal(u.read[1](x, k), max8);
    u.write[1](x, k, max8-(k%max8));
    test.equal(u.read[1](x, k), max8-(k%max8));

    u.write[2](x, k, max16);
    test.equal(u.read[2](x, k), max16);
    u.write[2](x, k, max16-(k%max16));
    test.equal(u.read[2](x, k), max16-(k%max16));

    u.write[3](x, k, max24);
    test.equal(u.read[3](x, k), max24);
    u.write[3](x, k, max24-(k%max24));
    test.equal(u.read[3](x, k), max24-(k%max24));

    u.write[4](x, k, max32);
    test.equal(u.read[4](x, k), max32);
    u.write[4](x, k, max32-(k%max32));
    test.equal(u.read[4](x, k), max32-(k%max32));

  }

  test.done();

};
