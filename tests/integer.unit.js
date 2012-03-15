#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit
var util = require ('util');

function helper (test, u, x, n, k, str, max) {

  function rp () {
    return  Math.floor(Math.random()*0xFFFFFFFF);
  }
  function rn () {
    return  -Math.floor(Math.random()*0xFFFFFFFF);
  }

  var R, Z;

  u.write[n](x, k, max);
  test.equal(u.read[n](x, k), max >>> 0,
      "Wrote "+max+" (maximum) as "+str+", should read the same!");

  //TODO: do `x.write*()` as well!
  if (n === 1) {
    test.equal(u.read[n](x, k), x.readUInt8(k),
        "Wrote "+max+" (maximum) as "+str+", should read the same with `Buffer.readUInt8`!");
  }
  if (n === 2) {
    //DANGER:  this code seems to break Node (or nodeunit?)!
    // `x.readUInt16(k));`
    // it gets dead slow and after few second pause it throws!
    test.equal(u.read[n](x, k), x.readUInt16BE(k),
        "Wrote "+max+" (maximum) as "+str+", should read the same with `Buffer.readUInt16BE`!");
  }
  //if (n === 3) {
  //  test.throws(u.read[n](x, k), x.readUInt24BE(k));
  //}
  if (n === 4) {
    test.equal(u.read[n](x, k), x.readUInt32BE(k),
        "Wrote "+max+" (maximum) as "+str+", should read the same with `Buffer.readUInt32BE`!");
  }

  u.write[n](x, k, Z=rn());

  test.equal(
      R = u.read[n](x, k),
      (Z & max) >>> 0,
      "Wrote "+Z+" (random), should read "+(Z&max)+" as "+str+"!");

  test.notEqual(R, Z,
      "Wrote "+Z+" (random), should not read "+Z+" as "+str+"!");

  test.ok(
      (R >= 0 && R <= (max >>> 0)),
      "Wrote "+Z+" (random), as "+str+" it should read value between 0 and "+max+"!");

  u.write[n](x, k, Z=rp());

  test.equal(
      R = u.read[n](x, k),
      (Z & max) >>> 0,
      "Wrote "+Z+" (random), should read "+((Z&max) >>>0)+" as "+str+"!");

  if (n === 4) {
    test.equal(R, (Z >>> 0),
        "Wrote "+Z+" (random), should read the same as "+str+"!");
  } else {
    test.notEqual(R, Z,
        "Wrote "+Z+" (random), as "+str+" it should not read "+Z+"!");
  }

  test.ok(
      (R >= 0 && R <= max),
      "Wrote "+Z+" (random), as "+str+" it should read value between 0 and "+max+"!");
}

exports['Equivalence mapping'] = function (test) {

  var u = require('../integer');
  //FIXME: use samll buffer on `*.travis-ci.org` hosts and big one otherwise!
  // i.e. call `hostname` or use `process.env` :)
  var x = new Buffer(1024);
  //TODO: use random values of offest parameter in these four ranges

  helper(test, u, x, 1, 100, "one ocet", 0xFF);
  helper(test, u, x, 2, 100, "two ocets", 0xFFFF);
  helper(test, u, x, 3, 100, "three ocets", 0xFFFFFF);
  helper(test, u, x, 4, 100, "four ocets", 0xFFFFFFFF);

  helper(test, u, x, 1, 300, "one ocet", 0xFF);
  helper(test, u, x, 2, 300, "two ocets", 0xFFFF);
  helper(test, u, x, 3, 300, "three ocets", 0xFFFFFF);
  //helper(test, u, x, 4, 300, "four ocets", 0xFFFFFFFF);

  helper(test, u, x, 1, 200, "one ocet", 0xFF);
  helper(test, u, x, 2, 200, "two ocets", 0xFFFF);
  helper(test, u, x, 3, 200, "three ocets", 0xFFFFFF);
  //helper(test, u, x, 4, 200, "four ocets", 0xFFFFFFFF);

  helper(test, u, x, 1, 400, "one ocet", 0xFF);
  helper(test, u, x, 2, 400, "two ocets", 0xFFFF);
  helper(test, u, x, 3, 400, "three ocets", 0xFFFFFF);
  //helper(test, u, x, 4, 400, "four ocets", 0xFFFFFFFF);

  test.done();

};
