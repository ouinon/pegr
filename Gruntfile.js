module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp/{,*/}*',
            'logs/apache/{,*/}*',
            'dist/{,*/}*',
            '!dist/.git{,*/}*'
          ]
        }]
      },
      removetmp:{
        files: [{
          dot: true,
          src: [
            '.tmp',
          ]
        }]
      },
      server: '.tmp'
    },

    wiredep: {

      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          '*.html'
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration

        }
      }
    },
    compass: {
      options: {
        sassDir: './styles',
        cssDir: '.tmp/styles',
        // generatedImagesDir: '.tmp/images/generated',
        // imagesDir: './images',
        // javascriptsDir: './scripts',
        // fontsDir: './styles/fonts',
        importPath: './bower_components',
        // httpImagesPath: '/images',
        // httpGeneratedImagesPath: '/images/generated',
        // httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {},
      // server: {
      //   options: {
      //     sourcemap: true
      //   }
      // }
    },
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
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
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '',
          dest: 'dist',
          src: [
            '.env',
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'node/{,**/}*.*',
            'templates/{,**/}*.*',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*',
            'fonts/{,*/}*.*',
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    cssmin: {
      options:{
        advanced:false,
        aggressiveMerging:false,
        restructuring:false,
        mediaMerging:false,
        shorthandCompacting:false,
        roundingPrecision:-1
      },
      dist: {
        files: {
          'dist/styles/main.css': ['.tmp/styles/{,*/}*.css']
        }
      }
    },
    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
          'dist/index.html': ['index.html']
        }
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scripts',
          src: '{,**/}*.js',
          dest: '.tmp/scripts'
        }]
      }
    },
    uglify: {
      options: {
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        }
      },
      bower_target: {
        expand:true,
        files: {
          'dist/scripts/lib.js': [
            'bower_components/angular/angular.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js'
          ]
        }
      },      
      source_target:{
        expand:true,
        files: {
          'dist/scripts/project.js': [
            '.tmp/scripts/routes.js',
            '.tmp/scripts/controllers/home.js',
            '.tmp/scripts/directives/o-input.js',
            '.tmp/scripts/directives/placeholder.js'
          ]
        }
      }
    }
  });
  
  // Source
  // https://github.com/stephenplusplus/grunt-wiredep
  grunt.registerTask('default',['wiredep']);


  grunt.registerTask('build', [
    'clean:dist',
    'compass',
    // //'wiredep',
    // //'useminPrepare',
    // // 'concurrent:dist',
    'autoprefixer:dist',
    // 'concat',
    'ngAnnotate',
    'copy:dist',
    // // 'cdnify',
    'cssmin',
    'processhtml',
    'uglify',
    // 'clean:removetmp',
    // 'filerev',
    // 'usemin',
    // 'htmlmin'
  ]);
  // grunt-contrib-compass
  // "grunt-contrib-clean"
  // "grunt-autoprefixer"
  // "grunt-contrib-concat"
  // "grunt-contrib-copy"
  // "grunt-contrib-cssmin"
  // "grunt-filerev"
  // "grunt-usemin"
  // "grunt-contrib-htmlmin"

// npm install --save-dev grunt-contrib-clean grunt-autoprefixer grunt-contrib-concat grunt-contrib-copy grunt-contrib-cssmin grunt-filerev grunt-usemin grunt-contrib-htmlmin 

};