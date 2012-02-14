#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');

var OptionsTable = require ( '../options.js' ),
    Decoder = require ( '../options.js' ).decode,
    Encoder = require ( '../options.js' ).encode;

var helper = require ( './generators.js' );


exports['Equivalence mapping'] = function (test) {

  test.equal( Encoder.isDefined('Content-Type'),
              Decoder.isDefined(1) );

  test.equal( OptionsTable.encode.isDefined('Content-Type'),
              OptionsTable.decode.isDefined(1) );

  test.equal( Encoder.isDefined('ETag'),
              Decoder.isDefined(Encoder.getNumber('ETag')) );

  var rand = []

  rand.push(helper.randomOptionName());

  test.equal( Encoder.isDefined(rand[0]),
              Decoder.isDefined(Encoder.getNumber(rand[0])),
              '... for `isDefined` on `'+rand[0]+'` (random)');


  rand.push(helper.randomOptionName());
  test.equal( Encoder.isCritical(rand[1]),
              Decoder.isCritical(Encoder.getNumber(rand[1])),
              'Equivalence mapping for `isCritical` on `'+rand[1]+'` (random)');

  rand.push(helper.randomOptionName());
  test.equal( Encoder.isCritical(rand[2]),
              Decoder.isCriticalAlt(Encoder.getNumber(rand[2])),
              'Equivalence mapping for `isCriticalAlt` on `'+rand[2]+'` (random)');

  rand.push(helper.randomOptionName());
  test.equal( Encoder.dataType(rand[3]),
              Decoder.dataType(Encoder.getNumber(rand[3])),
              'Equivalence mapping for `dataType` on `'+rand[3]+'` (random)');

  rand.push(helper.randomOptionName());
  test.equal( Encoder.allowMultiple(rand[4]),
              Decoder.allowMultiple(Encoder.getNumber(rand[4])),
              'Equivalence mapping for `allowMultiple` on `'+rand[4]+'` (random)');

  console.log('Random option names tested: ['+rand.join(', ')+']');

  test.done(); };
