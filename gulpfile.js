const gulp = require('gulp');
const sass = require('gulp-sass');
const iconfont = require('gulp-iconfont');
const autoprefixer = require('gulp-autoprefixer');
const consolidate = require('gulp-consolidate');
const del = require('del');
const runSequence = require('run-sequence');
const fontName = 'icon';

gulp.task('fontbuilder', () => gulp.src(['svgs/*.svg'])
	.pipe(iconfont({ fontName, normalize: true }))
	.on('glyphs', (glyphs) => {
		gulp.src('_fontTemplate.scss')
			.pipe(consolidate('lodash', {
				glyphs,
				fontName,
				fontPath: 'docs/fonts',
				className: fontName,
			})).pipe(gulp.dest('scss'));
	})
	.pipe(gulp.dest('docs/fonts'))
);

gulp.task('styles', () => gulp.src(['scss/styles.scss'])
	.pipe(sass({
		sourceComments: true,
		outputStyle: 'compressed',
	}))
	.on('error', () => {
		console.log("Oh No!");
	})
	.pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
	.pipe(gulp.dest('docs/css')));

gulp.task('clean', () => del(['./docs']));

gulp.task('views', () => gulp.src(['src/**/*', 'CNAME'])
		.pipe(gulp.dest('./docs')));

gulp.task('build', ['clean'], (cb) => {
	runSequence('fontbuilder', ['styles', 'views'], cb);
});
