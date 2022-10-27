const   gulp                    = require('gulp'),
        sass                    = require('gulp-sass')(require('sass')),
        browserSync             = require('browser-sync').create(),
        autoprefixer            = require('gulp-autoprefixer'),
        cleanCSS                = require('gulp-clean-css'),
        fileinclude             = require('gulp-file-include');
        // concat                  = require('gulp-concat');


// FILE PATHS
const paths = {
    scss: 'src/assets/sass/**/*.scss',
    scripts: {
        core: 'src/assets/js/**/*.js',
        plugins: {
            bootstrap: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            swiper: './node_modules/swiper/swiper-bundle.min.js'
        }
    },
    img: 'src/assets/img/**/*',
    fonts: {
        bootstrapIcons: './node_modules/bootstrap-icons/font/fonts/*'
    },
    fileInclude: {
        pages: 'src/pages/*.html',
        includes: 'src/includes/**/*.html',
        includesFolder: 'src/includes'
    }
}


// SOURCES TASKS
const compileStyles = () => {
    return gulp.src(paths.scss)
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.stream());
}
const compileScripts = () => {
    return gulp.src(paths.scripts.core)
        .pipe(gulp.dest('./build/assets/js'))
}
const compileMarkup = () => {
    return gulp.src(paths.fileInclude.pages)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: paths.fileInclude.includesFolder
        }))
        .pipe(gulp.dest('./build'))
}
const compileImages = () => {
    return gulp.src(paths.img)
        .pipe(gulp.dest('./build/assets/img'))
}
const compileFonts = () => {
    return gulp.src(paths.fonts.bootstrapIcons)
        .pipe(gulp.dest('./build/assets/fonts'))
}
const compilePluginScripts = () => {
    var plugins = paths.scripts.plugins;

    return gulp.src([
        plugins.bootstrap,
        plugins.swiper
    ]).pipe(gulp.dest('./build/assets/js/plugins'))
}


//// WATCH TASKS
const watchStyles = () => {
    gulp.watch(paths.scss, compileStyles);
}
const watchScripts = () => {
    gulp.watch(paths.scripts.core, gulp.series(compileScripts, serverReload));
}
const watchMarkup = () => {
    gulp.watch([
        paths.fileInclude.pages,
        paths.fileInclude.includes
    ], gulp.series(compileMarkup, serverReload));
}
const watchImages = () => {
    gulp.watch(paths.img, gulp.series(compileImages, serverReload));
}
const watchFonts = () => {
    gulp.watch(paths.fonts.bootstrapIcons, gulp.series(compileFonts, serverReload));
}
const watchPluginScripts = () => {
    var plugins = paths.scripts.plugins;

    gulp.watch([
        plugins.bootstrap,
        plugins.swiper
    ], compilePluginScripts);
}


// SERVER TASKS
const startServer = (done) => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        notify: false
    });
    done();
}

const serverReload = (done) => {
    browserSync.reload();
    done();
}


const compile = gulp.parallel(
    compileStyles,
    compileScripts,
    compileMarkup,
    compileImages,
    compileFonts,
    compilePluginScripts
);
compile.description = 'compile all sources.';

const watch = gulp.parallel(
    watchStyles,
    watchScripts,
    watchMarkup,
    watchImages,
    watchFonts,
    watchPluginScripts
);
watch.description = 'watch for changes on all sources';

const serve = gulp.series(compile, startServer);
serve.description = 'serve compiled sources on local server'

// Run "gulp build" to compile project
exports.build = compile;

// Run "gulp" to compile project and start local server
exports.default = gulp.parallel(serve, watch);