module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sshconfig: {
      'deploy_config': grunt.file.readJSON('deploy_config.json'),
    },
    clean: ['temp', 'dist'],
    haml: {
      dist: {
        files: grunt.file.expandMapping(['src/*.haml'], 'dist/', {
          rename: function(base, path) {
            return base + path.replace(/\.haml$/, '.html').replace(/src\//, '');
          }
        })
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'dist/js'
        }]
      }
    },
    include_bootstrap: {
      dist: {
        files: {
          'temp/css/styles.css': 'src/less/manifest.less'
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'temp/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      }
    },
    sftp: {
      deploy: {
        files: {
          './': 'dist/**'
        },
        options: {
          config: 'deploy_config',
          srcBasePath: 'dist/',
          createDirectories: true,
          showProgress: true
        }
      }
    },
    uncss: {
      dist: {
        files: {
          'dist/css/styles.min.css': ['dist/index.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-haml');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-include-bootstrap');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-ssh');

  grunt.registerTask('default', ['clean', 'haml', 'uglify', 'include_bootstrap', 'cssmin', 'uncss']);
  grunt.registerTask('deploy', ['default', 'sftp:deploy']);

};
