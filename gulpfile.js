const gulp = require('gulp');
const plumber = require('gulp-plumber');

// Browsersync はコメントアウトのまま残しておくぜ★
const browserSync = require('browser-sync').create();

const typescript = require('gulp-typescript');

// Node18 でも動く dart-sass を使うよ！
const dartSass = require('sass');
const sass = require('gulp-sass')(dartSass);

const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const htmlbeautify = require('gulp-html-beautify');

let target = 'dev';

// ---------- 単体タスク ----------
function pugTask() {
    return gulp.src('./src/templates/**/*.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlbeautify())
        .pipe(gulp.dest(`./${target}/`));
}

function sassTask() {
    const optsDev = { outputStyle: 'expanded' };
    const optsProd = { outputStyle: 'compressed' };

    let stream = gulp.src('./src/stylesheets/**/*.scss');

    if (target === 'dev') {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream
        .pipe(plumber())
        .pipe(sass(target === 'dev' ? optsDev : optsProd).on('error', sass.logError));

    if (target === 'dev') {
        stream = stream.pipe(sourcemaps.write());
    }

    return stream.pipe(gulp.dest(`./${target}/assets/css`));
}

function tsTask() {
    const tsArray = ['popup', 'background', 'contentscript', 'option'];

    // Promise.all で全てのビルドが終わるまで待つぜ★
    return Promise.all(tsArray.map(value => {
        return new Promise((resolve, reject) => {
            let stream = gulp.src(`./src/scripts/**/${value}.ts`);

            if (target === 'dev') {
                stream = stream.pipe(sourcemaps.init());
            }

            stream = stream
                .pipe(plumber())
                .pipe(typescript({
                    target: 'ES5',
                    removeComments: target !== 'dev',
                    outFile: `${value}.js`
                })).js;

            if (target === 'dev') {
                stream = stream.pipe(sourcemaps.write());
            }

            stream
                .pipe(gulp.dest(`./${target}/assets/js`))
                .on('end', resolve)
                .on('error', reject);
        });
    }));
}

function imagesTask() {
    return gulp.src('./src/images/**/*')
        .pipe(gulp.dest(`./${target}/images/`));
}

function filescopyTask() {
    const copyRoot = gulp.src('./src/*.{md,json}')
        .pipe(gulp.dest(`./${target}/`));

    const copyLocales = gulp.src('./src/_locales/**/*')
        .pipe(gulp.dest(`./${target}/_locales/`));

    const copyJquery = gulp.src('./src/scripts/module/jquery-1.11.1.min.js')
        .pipe(gulp.dest(`./${target}/assets/js/`));

    return Promise.all([copyRoot, copyLocales, copyJquery].map(stream => new Promise((resolve, reject) => {
        stream.on('end', resolve).on('error', reject);
    })));
}

// ---------- ユーティリティ ----------
function setDev(cb) { target = 'dev'; cb(); }
function setProd(cb) { target = 'prod'; cb(); }

function watchTask() {
    gulp.watch('./src/**/*.{md,json}', filescopyTask);
    gulp.watch('./src/images/**/*', imagesTask);
    gulp.watch('./src/templates/**/*.pug', pugTask);
    gulp.watch('./src/stylesheets/**/*.scss', sassTask);
    gulp.watch('./src/scripts/**/*.ts', tsTask);
}

// ---------- 複合タスク ----------
const build = gulp.parallel(filescopyTask, imagesTask, pugTask, sassTask, tsTask);

exports.dev = gulp.series(setDev, build, watchTask);
exports.prod = gulp.series(setProd, build, watchTask);

// 旧タスク名も一応エイリアスしておくね★
exports.pug = pugTask;
exports.sass = sassTask;
exports.ts = tsTask;
exports.images = imagesTask;
exports.filescopy = filescopyTask;

// デフォルトは dev
exports.default = exports.dev;
