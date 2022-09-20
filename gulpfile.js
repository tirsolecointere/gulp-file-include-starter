const { includes } = require('lodash');

var gulp                = require('gulp'),
    browserSync         = require('browser-sync').create(),
    sass                = require('gulp-sass'),
    // uglify              = require('gulp-uglify'),
    autoprefixer        = require('gulp-autoprefixer'),
    cleanCSS            = require('gulp-clean-css'),
    // imagemin            = require('gulp-imagemin'),
    fileinclude         = require('gulp-file-include');
    // htmlmin             = require('gulp-htmlmin'),
    concat              = require('gulp-concat');

// Static Server + watching scss/js/html files.
gulp.task('serve', ['sass', 'compressJs', 'fileinclude-watch', 'compressImage'], function () {
    browserSync.init({
        server: './build'
    });

    gulp.watch('src/assets/sass/**/*.scss', ['sass']);
    gulp.watch('src/assets/js/*.js', ['compressJs']);
    gulp.watch('src/assets/img/*', ['compressImage']);
    gulp.watch('./**/*.html', ['fileinclude-watch'])
});

// Sass task.
gulp.task('sass', function () {
    return gulp.src('src/assets/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream());
});

// Js task.
gulp.task('compressJs', function () {
    return gulp.src('src/assets/js/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js'))
});

// Images task.
gulp.task('compressImage', function () {
    return gulp.src('src/assets/img/**/*')
        // .pipe(imagemin({
        //     progressive: true,
        //     optimizationLevel: 3
        // }))
        .pipe(gulp.dest('./build/assets/img'))
});

// gulp include task
gulp.task('fileinclude', function() {
    gulp.src('src/pages/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: 'src/includes'
    }))
    .pipe(gulp.dest('./build'));
});

// Create a task that ensures the `fileinclude` task is complete before reloading browsers.
gulp.task('fileinclude-watch', ['fileinclude'], function () {
    browserSync.reload();
});

// Vendor scripts tasks.
gulp.task('vendors-scripts', function () {
    return gulp.src([
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./build/assets/js/'));
});

// fonts task.
gulp.task('fonts', function () {
    gulp.src([
        './node_modules/bootstrap-icons/font/fonts/*'
    ])
    .pipe(gulp.dest('./build/assets/fonts'));
});

// Compile project.
gulp.task('build-project', [
    'sass',
    'compressImage',
    'compressJs',
    'fileinclude',
    'vendors-scripts',
    'fonts'
]);

// Compile and start project.
gulp.task('default', ['build-project', 'serve']);