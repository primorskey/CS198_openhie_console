'use strict'

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai', 'dirty-chai'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/d3/d3.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-taglist/js/angular-taglist-directive.js',
      'app/bower_components/cryptojslib/rollups/sha512.js',
      'app/bower_components/vkBeautify/vkbeautify.js',
      'app/bower_components/angular-highlightjs/angular-highlightjs.min.js',
      'app/bower_components/ng-file-upload/angular-file-upload.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/spec/**/*.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
      'app/bower_components/morris.js/morris.js',
      'app/bower_components/angular-bootstrap-datetimepicker-directive/angular-bootstrap-datetimepicker-directive.js',
      'app/bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'app/bower_components/angular-fullscreen/src/angular-fullscreen.js',
      'app/bower_components/lodash/lodash.js',
      'app/bower_components/file-saver/FileSaver.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  })
}
