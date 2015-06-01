'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);


  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    less: {
      dist: {
        files: {
          'public/css/style.css': 'public/less/style.less',
          'public/css/coverbootstrap.css': 'public/less/coverbootstrap.less',
          'public/css/navbar.css': 'public/less/navbar.less',
          'public/css/enterprisetree.css': 'public/less/enterprisetree.less',
          'public/css/industrychart.css': 'public/less/industrychart.less',
          'public/css/authentication.css': 'public/less/authentication.less',
          'public/css/wordsmanage.css': 'public/less/wordsmanage.less',
          'public/css/searchwords.css': 'public/less/searchwords.less'
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "JST"
        },
        files: {
          "public/js/templates.js": ["public/templates/*.handlebars"]
        }
      }
    },
    coffee : {
      compile: {
        files: {
          'public/js/config.js' : 'public/coffee/config.coffee',
          'public/js/index.js' : 'public/coffee/index.coffee',
          'public/js/navbar.js' : 'public/coffee/navbar.coffee',
          'public/js/enterprisetree.js' : 'public/coffee/enterprisetree.coffee',
          'public/js/industrychart.js' : 'public/coffee/industrychart.coffee',
          'public/js/regist.js' : 'public/coffee/regist.coffee',
          'public/js/login.js' : 'public/coffee/login.coffee',
          'public/js/wordsmanage.js' : 'public/coffee/wordsmanage.coffee',
          'public/js/searchwordsmanage.js' : 'public/coffee/searchwordsmanage.coffee',
          'public/js/user.js' : 'public/coffee/user.coffee',
          'public/js/searchdoc.js' : 'public/coffee/searchdoc.coffee'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      css: {
        files: [
          'public/less/*.less'
        ],
        tasks: ['less'],
        options: {
          livereload: reloadPort
        }
      },
      coffee: {
        files: [
          'public/coffee/*.coffee'
        ],
        tasks: ['coffee']
      },
      handlebars: {
        files: [
          'public/templates/*.handlebars'
        ],
        tasks: ['handlebars']
      },
      views: {
        files: [
          'app/views/*.handlebars',
          'app/views/**/*.handlebars'
        ],
        options: { livereload: reloadPort }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  
  grunt.registerTask('default', [
    'less',
    'coffee',
    'handlebars',
    'develop',
    'watch'
  ]);
};
