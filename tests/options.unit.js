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

  var rand = [];

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

exports['Methods exposed'] = function (test) {

  test.ok(OptionsTable.hasOwnProperty('encode'),
      '`OptionsTable` should have an `encode` method!`');
  test.ok(OptionsTable.hasOwnProperty('decode'),
      '`OptionsTable` should have a `decode` method!`');

  test.ok(!Decoder.hasOwnProperty('decode'));
  test.ok(!Decoder.hasOwnProperty('encode'));
  test.ok(!Encoder.hasOwnProperty('decode'));
  test.ok(!Encoder.hasOwnProperty('encode'));

  var encoderKeys = Object.keys(Encoder);
  var decoderKeys = Object.keys(Decoder);

  var common = [];

  //for (var p in encoderKeys) {
  //  if (typeof Encoder[encoderKeys[p]] === 'function') {
  //    encoderMethods++;
  //    if (typeof Decoder[encoderKeys[p]] === 'function') {
  //      common++;
  //    }
  //  }
  //}
  
  console.log('Checking `Encoder` for the methods which `Decoder` has defined:');
  for (var d in decoderKeys) {
    if (typeof Decoder[decoderKeys[d]] === 'function') {
      switch (decoderKeys[d]) {

        case 'isCritical':
        case 'minLenght':
        case 'maxLenght':
        case 'defaultValue':
        case 'dataType':
        case 'allowMultiple':
        case 'isDefined':
          console.log('+ `'+decoderKeys[d]+'`');
          test.ok(Encoder.hasOwnProperty(decoderKeys[d]),
              'The `Encoder` should have method `'+decoderKeys[d]+'` '+
              'which is exposed by the `Decoder`!');
          common.push(decoderKeys[d]);
          break;

        case 'isCriticalAlt':
        case 'getName':
          console.log('- `'+decoderKeys[d]+'`');
          test.equal(Encoder.hasOwnProperty(decoderKeys[d]), false,
              'The `Encoder` should not have method `'+decoderKeys[d]+'` '+
              'which is exposed by the `Decoder`!');
          break;

        default:
          console.log('New method `'+decoderKeys[d]+'` implemented by the `Decoder`?');
          break;

      }
    }
  }

  console.log('Checking `Decoder` for the methods which `Encoder` has defined:');
  for (var d in encoderKeys) {
    if (typeof Encoder[encoderKeys[d]] === 'function') {
      switch (encoderKeys[d]) {

        case 'isCritical':
        case 'minLenght':
        case 'maxLenght':
        case 'defaultValue':
        case 'dataType':
        case 'allowMultiple':
        case 'isDefined':
          console.log('+ `'+encoderKeys[d]+'`');
          test.ok(Decoder.hasOwnProperty(encoderKeys[d]),
              'The `Encoder` should have method `'+encoderKeys[d]+'` '+
              'which is exposed by the `Decoder`!');
          /* This doesn't work?
          if (!encoderKeys[d] in common) {
            throw new Error('Test code is invalid!');
          };*/
          break;

        case 'getNumber':
          console.log('- `'+encoderKeys[d]+'`');
          test.equal(Decoder.hasOwnProperty(encoderKeys[d]), false,
              'The `Decoder` should not have method `'+encoderKeys[d]+'` '+
              'which is exposed by the `Decoder`!');
          break;

        default:
          console.log('New method `'+encoderKeys[d]+'` implemented by the `Encoder`?');
          break;

      }
    }
  }

  for (var d in encoderKeys) {
    if (typeof Encoder[encoderKeys[d]] === 'object') {
      for (var p in common) {
        test.equal(Decoder[common[p]](Encoder.getNumber(encoderKeys[d])),
                   Encoder[common[p]](encoderKeys[d]),
                   'Common method must all work fine!');

      }
    }
  }
    
  test.done(); }
