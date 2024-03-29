/*
 * Copyright (c) 2014 The Native Client Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

'use strict';

// Install coreutils.
// This test must be run before any tests that call executables in coreutils
// (e.g. ls).
TEST_F(DevEnvTest, 'testCoreUtils', function() {
  var self = this;
  return Promise.resolve().then(function() {
    return self.checkCommand('bash /mnt/http/package -i coreutils', 0);
  });
});

// Run a test on devenv, and clean the home directory afterwards. This allows
// for tests that touch files. Coreutils must be installed before this kind of
// test can be run.
function DevEnvFileTest() {
  DevEnvTest.call(this);
}
DevEnvFileTest.prototype = new DevEnvTest();
DevEnvFileTest.prototype.constructor = DevEnvFileTest;

DevEnvFileTest.prototype.setUp = function() {
  var self = this;
  return Promise.resolve().then(function() {
    return DevEnvTest.prototype.setUp.call(self);
  }).then(function() {
    return self.initFileSystem();
  }).then(function() {
    return self.mkdir('/home/user');
  });
};

DevEnvFileTest.prototype.tearDown = function() {
  var self = this;
  return Promise.resolve().then(function() {
    return self.rmRf('/home/user');
  }).then(function() {
    return DevEnvTest.prototype.tearDown.call(self);
  });
};

// Test mkdir, ls, and rmdir.
TEST_F(DevEnvFileTest, 'testDirs', function() {
  var self = this;
  return Promise.resolve().then(function() {
    return self.checkCommand('mkdir foo', 0, '');
  }).then(function() {
    return self.checkCommand('ls', 0, 'foo\n');
  }).then(function() {
    return self.checkCommand('rmdir foo', 0, '');
  });
});

// Test cat and rm.
TEST_F(DevEnvFileTest, 'testCatRm', function() {
  var self = this;
  var str = 'Hello, world!\n';
  return Promise.resolve().then(function() {
    return self.writeFile('/home/user/foo.txt', str);
  }).then(function() {
    return self.checkCommand('cat foo.txt', 0, str);
  }).then(function() {
    return self.checkCommand('rm foo.txt', 0, '');
  });
});
