module.exports = function (grunt) {
  'use strict';
  
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      dev: {
        src: ['.tmp']
      },
      dist: {
        src: ['dist','.tmp']
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    copy: {
      html: {
        files: [{
          expand: true,
          cwd: 'src/',
          src:  ['**.html'],
          dest: '.tmp/',
          filter: 'isFile'
        }]
      },
      dropbox: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['**/*'],
          dest: '/Users/Don/Dropbox/Public/flixpress/pricing-grid/'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    sass: {
      options: {
        sourcemap: 'none',
        compass: true,
        require: ['susy','breakpoint'],
        bundleExec: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['**.{scss,sass}'],
          dest: '.tmp',
          ext: '.css'
        }]
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', /*'qunit'*/]
      },
      sass: {
        files: 'src/**/*.{sass,scss}',
        tasks: ['sass:dev']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', /*'qunit'*/]
      },
      html: {
        files: 'src/**.html',
        tasks: ['copy:html']
      },
      livereload: {
        options: {
          livereload: '<%= connect.server.options.livereload %>'
        },
        files: [
          '.tmp/*'
        ]
      },
      dropbox: {
        files: [
          '.tmp/*'
        ],
        tasks: ['copy:dropbox']
      }
    },
    postcss: {
      dev: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: '> 0.05%'})
          ]
        },
        src: '.tmp/*.css'
      },    
      dist: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: '> 0.05%'})
          ],
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['.tmp/*.css', '!.tmp/*.min.css'],
          dest: 'dist/'
        }]
      },
      distmin: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: '> 0.05%'}),
            require('csswring')
          ],
        },
        files: [{
          expand: true,
          flatten: true,
          src: '.tmp/*.css',
          dest: 'dist/',
          ext: '.min.css'
        }]
      },
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9000,
          livereload: 35728,
          base: '.tmp',
          open: {
            target: 'http://localhost:9000/',
            appName: 'google chrome'
          }
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify', 'css:dist']);
  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });
  grunt.registerTask('serve', ['clean:dev', 'css', 'connect', 'copy:html', 'watch']);
  
  grunt.registerTask('css', function (target){
    if (target === 'dist') {
      return grunt.task.run(['sass', 'postcss:dist', 'postcss:distmin']);
    }
    grunt.task.run(['sass:dev', 'postcss:dev']);
  });
  // I'm not familiar with how testing works
  //grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
