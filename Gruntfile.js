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
      dev: {
        files: [{
          expand: true,
          cwd: 'src/',
          src:  ['**/*.{html,js,png,jpg}'],
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
        tasks: ['sass:dev', 'css:dist']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', /*'qunit'*/]
      },
      dev: {
        files: 'src/**/*.{html,js}',
        tasks: ['copy:dev']
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
          base: ['bower_components','.tmp'],
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
  grunt.registerTask('serve', ['clean:dev', 'css', 'connect', 'copy:dev', 'watch']);
  
  grunt.registerTask('css', function (target){
    if (target === 'dist') {
      return grunt.task.run(['sass', 'postcss:dist', 'postcss:distmin']);
    }
    grunt.task.run(['sass:dev', 'postcss:dev']);
  });

  grunt.registerTask('sassTo', function (target){
    var folder = grunt.option('folder');
    if (folder === undefined){
      grunt.fail.warn('`folder` was undefined. Add `--folder path/to/folder` to continue. Or force to store in `.tmp`');
      folder = '.tmp/undefinedVariable';
    }
    var newPostcss = {
      dist: {
        options: {
          processors: [
            require('autoprefixer-core')({browsers: '> 0.05%'})
          ],
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['.tmp/**/*.css'],
          dest: folder
        }]
      },
    };
    var newWatch = {
      sass: {
        files: ['src/**/*.{sass,scss}'],
        tasks: ['sass', 'postcss:dist'],
        options: {
          spawn: false,
        },
      }
    };
    
    //grunt.log.writeln(JSON.stringify(newCopy, null, 4));
    grunt.config.set('postcss',newPostcss);
    grunt.config.set('watch',newWatch);
    
    grunt.event.on('watch', function(action, filepath) {
      grunt.log.writeln(action + " " + filepath);
      grunt.config('sass.dev.files.0.cwd', '.');
      grunt.config('sass.dev.files.0.src', filepath);
      grunt.log.writeln(JSON.stringify(grunt.config('sass.dev'), null, 4));
    });

    grunt.task.run(['clean:dev', 'watch']);
  });
  // I'm not familiar with how testing works
  //grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
