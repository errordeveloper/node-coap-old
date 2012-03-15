#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit
var util = require ('util');

function helper (test, u, x, n, k, str, max) {
  //var n = 3; str = "one ocet", max = 0xFFFFFF;

  function rp () {
    return  Math.floor(Math.random()*0xFFFFFFFF);
  }
  function rn () {
    return  -Math.floor(Math.random()*0xFFFFFFFF);
  }

  var R, Z;

  u.write[n](x, k, max);
  test.equal(u.read[n](x, k), max,
      "Wrote "+max+" (maximum) as "+str+", should read the same!");

  u.write[n](x, k, Z=rn());

  test.equal(
      R = u.read[n](x, k),
      Z & max,
      "Wrote "+Z+" (random), should read "+(Z&max)+" as "+str+"!");

  test.notEqual(R, Z,
      "Wrote "+Z+" (random), should not read "+Z+"!");

  test.ok(
      (R >= 0 && R <= max),
      "Wrote "+Z+" (random), should read value between 0 and "+max+"!");

  u.write[n](x, k, Z=rp());

  test.equal(
      R = u.read[n](x, k),
      Z & max,
      "Wrote "+Z+" (random), should read "+(Z&max)+" as "+str+"!");

  test.notEqual(R, Z,
      "Wrote "+Z+" (random), should not read "+Z+"!");

  test.ok(
      (R >= 0 && R <= max),
      "Wrote "+Z+" (random), should read value between 0 and "+max+"!");
}

exports['Equivalence mapping'] = function (test) {

  var u = require('../integer');
  var x = new Buffer(200000000+64);

  helper(test, u, x, 1, 100, "one ocet", 0xFF);
  helper(test, u, x, 2, 100, "two ocets", 0xFFFF);
  helper(test, u, x, 3, 100, "three ocets", 0xFFFFFF);
  helper(test, u, x, 4, 100, "four ocets", 0xFFFFFFFF);

  test.done();

};
