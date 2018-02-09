const { dest, parallel, series, src, task, watch } = require('gulp');
const sass = require('gulp-sass');
const browserSyncPkg = require('browser-sync');
const renderIawritertemplate = require('./lib/plugins/render-iawritertemplate');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');

const browserSync = browserSyncPkg.create();

task('styles', () =>
	src('./src/templates/**/Contents/Resources/style.scss')
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass().on('error', sass.logError))
		.pipe(
			postcss([
				autoprefixer({
					browsers: ['last 2 iOS versions', 'last 2 Safari versions'],
					flexbox: 'no-2009',
				}),
			])
		)
		.pipe(sourcemaps.write())
		.pipe(dest('dist'))
		.pipe(browserSync.stream())
);

task('static', () => src('./src/templates/**/*.[!scss]*').pipe(dest('dist')));

task('demo', () =>
	src('./src/{templates/**/*.{html,plist},content/*.md}')
		.pipe(renderIawritertemplate())
		.pipe(dest('dist'))
);

task('server', () => {
	browserSync.init({
		server: './dist',
		open: false,
	});

	watch('src/styles/**/*.scss', series('styles'));
	watch('src/{templates/**/*.*,content/*.md}', series('demo')).on('change', browserSync.reload);
});

task('default', series(parallel('styles', 'static', 'demo'), 'server'));
