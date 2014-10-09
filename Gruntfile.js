module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  
    pkg: grunt.file.readJSON('package.json'),
	sass: {                             
		dist: {                           
		  options: {                       
			style: 'expanded'
		  },
		  files: [{
			expand: true,
			cwd: 'sass',
			src: ['*.scss'],
			dest: 'dest/css',
			ext: '.css'
		  }]
		}
	},
	postcss: {
		options: {
		  map: false,
		  processors: [
			require('autoprefixer-core')({browsers: 'last 5 version'}).postcss,
//			require('csswring').postcss
		  ]
		},
		dist: {
		  src: 'dest/css/*.css'
		}
	 },
	 sprite:{
      all: {
        src: 'sprite-images/*.png',
        destImg: 'dest/images/sprites/sprite.png',
        destCSS: 'dest/css/sprite.css',
		algorithm: 'binary-tree',
		padding: 2,
      }
    },
	webfont: {
	  icons: {
		src: 'font-icons/*.svg',
		dest: 'dest/fonts',
		destCss: 'sass',
		options: {
		  font: 'thestore-icons',
		  engine: 'node',
		  syntax: 'bootstrap',
		  stylesheet: 'scss',
		  relativeFontPath: '../fonts'
		}
	  }
	},
	  watch: {
		options: {
		  spawn: false,
		  livereload: true,
		},
		css: {
		  files: ['**/*.scss'],
		  tasks: ['sass'],
		},
	  },
	
  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-webfont');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'postcss']);

};