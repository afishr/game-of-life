'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	htmlmin = require('gulp-htmlmin'),
	sass = require('gulp-sass'),
	newer = require('gulp-newer'),
	sourcemap = require('gulp-sourcemaps'),
	paths = {
		src: {
			html: 'src/**/[^_]*.html',
			script: 'src/js/**/[^_]*.*',
			style: 'src/sass/**/[^_]*.*',
			img: 'src/img/**/*.*'
		},
		dist: {
			html: 'dist/',
			script: 'dist/js/',
			style: 'dist/css/',
			img: 'dist/img/'
		},
		prod: {
			html: 'dist/',
			script: 'dist/js/',
			style: 'dist/css/',
			img: 'dist/img/'
		},
		watch: {
			html: 'src/**/*.html',
			script: 'src/js/**/*.*',
			style: 'src/sass/**/*.*',
			img: 'src/img/**/*.*'
		}
	},
	devServerConfig = {
		server: {
			baseDir: "dist/"
		},
		open: false,
		notify: false,
		tunnel: false,
		host: 'localhost',
		port: 7898,
		logPrefix: "BS"
	};


/* Dev build*/
/* HTML-dev-Build */
gulp.task('html-dev-build', function() {
	return gulp.src(paths.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(paths.dist.html))
});


/* Style-dev-Build */
gulp.task('style-dev-build', function() {
	return gulp.src(paths.src.style)
		.pipe(sourcemap.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(prefixer({
			browsers: ['last 5 versions', 'IE 8'],
			add: true,
			cascade: false,
			remove: false
		}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(paths.dist.style))
});

/* Script-dev-Build */
gulp.task('script-dev-build', function() {
	return gulp.src(paths.src.script)
		.pipe(sourcemap.init())
		.pipe(rigger())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(paths.dist.script))
});

/* Images-dev-Build */
gulp.task('img-dev-build', function() {
	return gulp.src(paths.src.img)
		.pipe(newer(paths.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(paths.dist.img))
});

/*Productin build*/
/* HTML-prod-Build */
gulp.task('html-prod-build', function() {
	gulp.src(paths.src.html)
		.pipe(rigger())
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(gulp.dest(paths.prod.html));
});

/* Style-prod-Build */
gulp.task('style-prod-build', function() {
	return gulp.src(paths.src.style)
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(prefixer({
			browsers: ['last 5 versions', 'IE 8'],
			add: true,
			cascade: false,
			remove: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(paths.prod.style));
});

/* Script-prod-Build */
gulp.task('script-prod-build', function() {
	return gulp.src(paths.src.script)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(paths.prod.script));
});

/* Images-prod-Build */
gulp.task('img-prod-build', function() {
	return gulp.src(paths.src.img)
		.pipe(newer(paths.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(paths.prod.img))
});


/*Common*/
/* WebServer */
gulp.task('serve', function() {
	browserSync.init(devServerConfig);
	browserSync.watch('src', browserSync.reload);
});

/* Watch */
gulp.task('watch', function() {
	gulp.watch(paths.watch.html, gulp.series('html-dev-build'));
	gulp.watch(paths.watch.style, gulp.series('style-dev-build'));
	gulp.watch(paths.watch.script, gulp.series('script-dev-build'));
	gulp.watch(paths.watch.img, gulp.series('img-dev-build'));
});

/* Build */
gulp.task('prod', gulp.series(
	'style-prod-build',
	'script-prod-build',
	'img-prod-build',
	'html-prod-build'
));

gulp.task('dev', gulp.series(
	'html-dev-build',
	'style-dev-build',
	'script-dev-build',
	'img-dev-build'
));

/* Default */
gulp.task('default', gulp.parallel('dev', 'watch', 'serve'));
