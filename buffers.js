#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');

function write32(buffer, value, offset) {
  buffer[offset]   = (value >>> 0x18) & 0xff;
  buffer[offset+1] = (value >>> 0x10) & 0xff;
  buffer[offset+2] = (value >>> 0x08) & 0xff;
  buffer[offset+3] = (value) & 0xff;
}

function read32(buffer, offset) {
  return 0xffffffff & (
    (buffer[offset]   << 0x18) |
    (buffer[offset+1] << 0x10) |
    (buffer[offset+2] << 0x08) |
    (buffer[offset+3])
  );
}

function write24(buffer, value, offset) {
  buffer[offset]     = (value >>> 0x10) & 0xff;
  buffer[offset + 1] = (value >>> 0x08) & 0xff;
  buffer[offset + 2] = (value) & 0xff;
}

function read24(buffer, offset) {
  return 0xffffff & (
    (buffer[offset]   << 0x10) |
    (buffer[offset+1] << 0x08) |
    (buffer[offset+2])
  );
}

function write16(buffer, value, offset) {
  buffer[offset]   = (value >>> 0x08) & 0xff;
  buffer[offset+1] = (value) & 0xff;
}

function read16(buffer, offset) {
  return 0xffff & (
    (buffer[offset]   << 0x08) |
    (buffer[offset+1])
  );
}

function read8(buffer, offset) {
  return 0xff & (
    (buffer[offset])
  );
}

function write8(buffer, value, offset) {
  buffer[offset] = (value) & 0xff;
}


exports['Equivalence mapping'] = function (test) {
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

    write8(x, k, max8);
    test.equal(read8(x, k), max8);
    write8(x, k, max8-(k%max8));
    test.equal(read8(x, k), max8-(k%max8));

    write16(x, k, max16);
    test.equal(read16(x, k), max16);
    write16(x, k, max16-(k%max16));
    test.equal(read16(x, k), max16-(k%max16));

    write24(x, k, max24);
    test.equal(read24(x, k), max24);
    write24(x, k, max24-(k%max24));
    test.equal(read24(x, k), max24-(k%max24));

    write32(x, k, max32);
    test.equal(read32(x, k), max32);
    write24(x, k, max32-(k%max32));
    test.equal(read32(x, k), max32-(k%max32));

  }

  test.done();

};
