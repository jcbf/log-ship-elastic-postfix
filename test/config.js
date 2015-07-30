'use strict';
/* jshint maxlen: 100 */

var assert  = require('assert');
var fs      = require('fs');
var path    = require('path');

var shipper  = require('../index');
var hostName = require('os').hostname();

describe('log-ship-elasticsearch-postfix', function () {
    var Ship = shipper.createShipper('./test');

    describe('config', function () {
        it('finds a log-ship-elasticsearch-postfix.ini', function (done) {
            assert.ok(Ship);
            done();
        });

        it('config has required sections', function (done) {
            // console.log(cfg);
            ['main', 'elastic', 'parser', 'reader'].forEach(function (s) {
                assert.ok(Ship.cfg[s]);
            });
            done();
        });

        it('spool dir is defined', function (done) {
            assert.ok(Ship.cfg.main.spool);
            done();
        });

        it('spool dir is writable', function (done) {
            Ship.isWritable(Ship.cfg.main.spool, function (err) {
                assert.ifError(err);
                done();
            });
        });

        it('errs if spool dir is not writable', function (done) {
            var errShip = shipper.createShipper('./test');
            errShip.spool = path.resolve('./test', 'spool.nowrite');
            // console.log(errShip);
            errShip.validateSpoolDir(function (err) {
                assert.equal(err.code, 'EACCES');
                done();
            });
        });
    });

    describe('fs utilities', function () {
        it('isDirectory reports true for dir', function (done) {
            assert.equal(
                Ship.isDirectory(path.resolve('./test', 'spool')), true);
            done();
        });

        it('isDirectory reports false for file', function (done) {
            var spoolFile = path.resolve('./test', 'spool.file');
            assert.equal(Ship.isDirectory(spoolFile), false);
            done();
        });

        it('isWritable reports true for writable dir', function (done) {
            var spoolDir = path.resolve('./test', 'spool');
            assert.equal(Ship.isWritable(spoolDir), true);
            done();
        });

        it('isWritable reports false for non-writable dir', function (done) {
            var spoolDir = path.resolve('./test', 'spool.nowrite');
            assert.equal(Ship.isWritable(spoolDir), false);
            done();
        });

        it('isWritablePreV12 reports true for writable dir', function (done) {
            var spoolDir = path.resolve('./test', 'spool');
            assert.equal(Ship.isWritablePreV12(spoolDir), true);
            done();
        });

        it('isWritablePreV12 reports false for non-writable dir', function (done) {
            var spoolDir = path.resolve('./test', 'spool.nowrite');
            assert.equal(Ship.isWritablePreV12(spoolDir), false);
            done();
        });
    });
});
