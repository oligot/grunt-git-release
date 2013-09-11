/*
 * grunt-git-release
 * https://github.com/oli/grunt-git-release
 *
 * Copyright (c) 2013 Olivier Ligot
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var semver = require('semver');
var shell = require('shelljs');
var _ = require('underscore');
var inquirer = require('inquirer');

module.exports = function(grunt) {

  grunt.registerTask('release', 'Release a new version of your Git project', function(type) {
    function bump(filenames, version) {
      _.each(filenames, function(filename) {
        var pkg = grunt.file.readJSON(filename);
        pkg.version = version;
        grunt.file.write(filename, JSON.stringify(pkg, null, '  ') + '\n');
      });
    }

    function run(cmd, msg) {
      shell.exec(cmd, {silent: true});
      grunt.log.ok(msg);
    }

    var done = this.async();
    var pkg = grunt.file.readJSON('package.json');
    var newVersion = semver.inc(pkg.version, type || 'patch') || type;
    var tag = 'v' + newVersion;
    var filenames = ['package.json'];
    if (fs.existsSync('system.json')) {
      filenames.push('system.json');
    }
    inquirer.prompt([{
      type: 'confirm',
      name: 'confirmation',
      message: 'Do you want to create tag ' + tag + '?',
    default: false
    }], function(answers) {
      if (answers.confirmation) {
        bump(filenames, newVersion);
        grunt.log.ok('Version bumped to ' + newVersion);
        shell.exec('git add ' + filenames.join(' '));
        run('git commit -m "Version ' + newVersion + '"', filenames.join(' ') + ' committed');
        run('git tag -a ' + tag + ' -m "Tag ' + tag + '"', 'Tag ' + tag + ' created');
        run('git push', 'Pushed to remote');
        run('git push --tags', 'Pushed new tag ' + tag + ' to remote');
      }
      done();
    });
  });

};
