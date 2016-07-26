
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	stylus = require('gulp-stylus'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	rename = require('gulp-rename'),
	babel = require('babelify'),
	nib = require('nib');


// Servidor web de desarrollo
	gulp.task('server', function(){
		connect.server({
			root: './public',
			hostname: '0.0.0.0',
			port: 8080,
			livereload: true
		});
	});


//Procesa los archivos STYLUS a CSS y Recarga los cambios
	gulp.task('css', function(){
		gulp.src('./app.styl')
			.pipe(stylus({ use: nib() }))
			.pipe(gulp.dest('./public'))
			.pipe(connect.reload());

		gulp.src('./media-queries.css')
			.pipe(gulp.dest('./public'))
			.pipe(connect.reload());

	});

//Realiza la compilacion de JS
	var bundle = browserify('./src/app.js')
	function compiler(watch){

		if(watch){
			bundle = watchify(bundle)
			bundle.on('update', function(){
				console.log('---> Bundling JS ....');
				connect.reload();
				recompile();
			})
		}
		function recompile(){
			bundle
				.transform(babel, {presets: ['es2015']})
				.bundle()
				.on('error', function(err){ console.log(err);})
				.pipe(source('app.js'))
				.pipe(rename('bundle.js'))
				.pipe(gulp.dest('public'));	
		}
		recompile();

	}

	gulp.task('images', function(){
		gulp
			.src('./*.png')
			.pipe(gulp.dest('public/img'))
			.pipe(connect.reload());

		gulp
			.src('./*.jpg')
			.pipe(gulp.dest('public/img'))
			.pipe(connect.reload());

		gulp
			.src('./*.jpeg')
			.pipe(gulp.dest('public/img'))
			.pipe(connect.reload());
	})
	




//Recarga el Navegador cuando hay cambios en HTML
	gulp.task('html', function(){
		gulp.src('./*.html')
		.pipe(gulp.dest('public'))
		.pipe(connect.reload());
	});



 // Vigila cambios que se produzcan en el codigo
 // y lanza las tareas relacionadas

 	gulp.task('watch', function(){
 		gulp.watch(['./*.html'], ['html']);
 		gulp.watch(['./*.styl'], ['css']);
 		gulp.watch(['./*.css'], ['css']);

 	});

 	gulp.task('build', function(){
 		compiler();
 	})

 	gulp.task('watch-build', function(){
 		compiler(true);
 	})


 	gulp.task('default', ['server','watch', 'watch-build', 'html', 'css', 'images']);

