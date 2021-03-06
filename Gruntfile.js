// Generated on 2015-09-16 using
// generator-webapp 1.0.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  // 任务执行所用的时间，可以对构建时间优化提供帮助
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  // 自动加载需要用到的grunt 任务，加速插件加载
  require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    app: 'app/diguaApp',
    dist: 'dist',
    tpl:'template'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    // 实时监听文件的增删改
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep','bower']
      },
      babel: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['babel:dist']
      },
      babelTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['babel:test', 'test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.tpl %>/css/{,*/}*.css'],
        tasks: ['copy:styles', 'postcss']
      },
      //jade变化
      jade:{
        files:['<%= config.tpl %>/**/*.{html,jade}'],
        tasks:['jade']
      },
      less:{
        files: ['<%= config.tpl %>/less/**/*.less'],
        tasks: ['less'],
      },
      images:{
        files: ['<%= config.tpl %>/images/**/*.*'],
        tasks: ['copy:images'],
      },
      js:{
        files: ['<%= config.tpl %>/**/*.js'],
        tasks: ['copy:js'],
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [
            '<%= config.app %>/{,*/}*.html',
            // '.tmp/styles/{,*/}*.css',
            '<%= config.app %>/images/{,*/}*',
            // '.tmp/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['./app'],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: { // 几乎去掉测试部分
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['.tmp', './test', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%= config.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    // 确保代码风格达到标准,没有明显的错误
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    // 摩卡测试框架配置选项
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/index.html']
        }
      }
    },

    // Compiles ES6 with Babel
    babel: {
      options: {
          sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: '{,*/}*.js',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.js',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer-core')({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    // 自动注入bower插件到html文件中
    wiredep: {
        app: {
            src: ['<%= config.app %>/*.html'],
            // exclude: ['bootstrap.js'],
            ignorePath: /^(\.\.\/)*\.\./
        }
    },
    // Renames files for browser caching purposes  取消此部分，暂不对文件重命名
    // filerev: {
    //   dist: {
    //     src: [
    //       '<%= config.dist %>/scripts/{,*/}*.js',
    //       '<%= config.dist %>/styles/{,*/}*.css',
    //       '<%= config.dist %>/images/{,*/}*.*',
    //       '<%= config.dist %>/styles/fonts/{,*/}*.*',
    //       '<%= config.dist %>/*.{ico,png}'
    //     ]
    //   }
    // },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: '<%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/images',
          '<%= config.dist %>/styles'
        ]
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= config.dist %>'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.tpl %>/css',
        dest: '<%= config.app %>/css',
        src: '{,*/}*.css'
      },
      images:{
        expand: true,
        dot: true,
        cwd: '<%= config.tpl %>/images',
        dest: '<%= config.app %>/images',
        src: '{,*/}*.*'
      },
      js:{
        expand: true,
        dot: true,
        cwd: '<%= config.tpl %>/',
        dest: '<%= config.app %>',
        src: '**/*.js'
      },
      plugs:{
          expand: true,
          dot: true,
          cwd: '<%= config.tpl %>/plugs',
          dest: '<%= config.app %>/plugs',
          src: '**/*.*'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'babel:dist',
        'copy:styles'
      ],
      test: [
        'babel',
        'copy:styles'
      ],
      dist: [
        'babel',
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },
    //jade模板预编译
    jade: {
        dist: {
            options: {
                pretty: true
            },
            files: [{
                expand: true,
                cwd: '<%= config.tpl %>',
                dest: '<%= config.app%>',
                src: ['**/*.html'],//,'*.html'
                ext: '.html'
            }]
        }
    },
    //bower task
    bower:{
      install:{
        options:{
          targetDir:'<%= config.tpl %>/plugs',
          layout:'byComponent',
          install:true,
          verbose:false,
          cleanTargerDir:false,
          cleanBowerDir:false,
          bowerOptions:{}
        }
      }
    },
    less:{
      options:{
        compress: true,
        yuicompress: true
      },
      main: {
        expand: true,
        cwd: '<%= config.tpl %>/less/',
        src: ['common.less','login.less'],
        dest: '<%= config.tpl %>/css/',
        ext: '.css'
      },
    }
  });
  // jit 无法加载 只能手动加载bower任务
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('serve', 'start the server and preview your app', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }
    //执行任务
    grunt.task.run([
      //jade 模板编译任务
      'jade',
      'clean:server',
      // 'wiredep',
      'less',
      'copy',
      'concurrent:server',
      'postcss',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });
  /*
  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'postcss'
      ]);
    }

    grunt.task.run([
      'browserSync:test',
      'mocha'
    ]);
  });
  */
  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    // 'concat',
    // 'cssmin',
    // 'uglify',
    // 'copy:dist',
    // 'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:eslint',
    'test',
    'build'
  ]);
};
