var gulp = require( 'gulp' );
var del = require( 'del' );

var paths = {
	json : ['./src/definitions/**/*.json'],
	build: {
		json    : './build/definitions/',
		toString: () => './build'
	}
};

gulp.task( 'clean', function() {
	return del( '' + paths.build );
} );

gulp.task( 'copy:json', function() {
	return gulp.src( paths.json )
		.pipe( gulp.dest( paths.build.json ) );
} );