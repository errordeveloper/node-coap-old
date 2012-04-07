#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit
var ContentTypes = require ( '../content' );
var Decoder = ContentTypes.decode;
var Encoder = ContentTypes.encode;


function helper (test, type) {
  test.equal(Decoder(Encoder(type)), type,
      'Encoding `'+type+'` should decode as `'+type+'`!');
}

exports['Equivalence mapping'] = function (test) {
  helper(test, 'text/plain');
  helper(test, 'application/link-format');
  helper(test, 'application/xml');
  helper(test, 'application/octet-stream');
  helper(test, 'application/exi');
  helper(test, 'application/json');

  test.equal(Encoder('unclassified/undefined'), 0x2a,
      'Unknown types (given as strings) should be encoded as `application/octet-stream`!'
  );

  test.equal(Encoder(0xfa), 0xfa,
      'Unknown types (give as numbers) should be encoded as is!');

  test.equal(Decoder(Encoder(0xfa)), 'application/octet-stream',
      'Unknown types (give as numbers) should be encoded as is, but decoded as `application/octet-stream`!');

  test.done();
}

exports['Methods exposed'] = function (test) {

  test.ok(ContentTypes.encode.constructor === Function,
      '`ContentTypes.encode` should be a function!');
  test.ok(ContentTypes.decode.constructor === Function,
      '`ContentTypes.decode` should be a function!');

  test.done();

}
