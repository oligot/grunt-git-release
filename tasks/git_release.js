/*
 * grunt-git-release
 * https://github.com/oli/grunt-git-release
 *
 * Copyright (c) 2013 Olivier Ligot
 * Licensed under the MIT license.
 */

'use strict';

var release = require('git-release');

module.exports = function(grunt) {

  grunt.registerTask('release', 'Release a new version of your Git project', function(type) {
    var done = this.async();
    release(type, done);
  });

};
