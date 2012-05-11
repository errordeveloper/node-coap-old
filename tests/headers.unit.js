#!/usr/bin/env node node_modules/nodeunit/bin/nodeunit

var util = require ('util');

var ParseHeaders = require ( '../headers.js' ),
    Decoder = require ( '../headers.js' ).decode,
    Encoder = require ( '../headers.js' ).encode;

exports['Equivalence mapping'] = function (test) {

  var buf_tx = new Buffer([0, 0, 0, 0, 1, 2, 3, 4]);

  var req_tx = {
    protocolVersion: 1,
    optionsCount: 0,
    messageCode: 4,
    messageType: 'CON',
    messageID: 1991,
    payload: buf_tx };

  req_tx.payload[4]++;

  //console.log('buf_tx: '+util.inspect(buf_tx));

  var req_rx = Decoder(Encoder(req_tx),
      {address: '23.0.0.0', port: 100, size: -1});

  //console.log('buf_tx: '+util.inspect(buf_tx));
  //console.log('req_rx: '+util.inspect(req_rx));

  req_tx.protocolVersion--;
  test.notEqual(req_tx.protocolVersion, req_rx.protocolVersion,
      'Object reffereced badly: `*req_rx = &req_tx` ?!?');

  test.equal(req_tx.messageCode, req_rx.messageCode,
      'Parser not working, wrong `messageCode`!');
  test.equal(req_tx.messageType, req_rx.messageType,
      'Parser not working, wrong `messageType`!');

  test.equal( req_rx.payload[0], buf_tx[4],
      'Buffer consitency error `req_rx.payload[0] != buf_tx[4]`');
  // These are redundant, but just to make sure we still understand JS!
  test.equal( req_tx.payload[5], req_rx.payload[1],
      'Buffer consitency error: `req_tx.payload[5] != req_rx.payload[5]`!');
  test.notEqual( req_tx.payload[6], buf_tx[7],
      'Buffer consitency error: `req_tx.payload[6] != buf_tx[7]`!');
  test.equal( buf_tx[5], req_rx.payload[0],
      'Buffer consitency error: `buf_tx[5] != req_rx.payload[0]`!');

  test.done();

};

exports['Methods exposed'] = function (test) {

  test.ok(ParseHeaders.hasOwnProperty('encode'));
  test.ok(ParseHeaders.hasOwnProperty('decode'));

  test.done(); };
