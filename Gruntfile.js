module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
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
    }
  });
  // Source
  // https://github.com/stephenplusplus/grunt-wiredep
  grunt.registerTask('default',['wiredep']);

};