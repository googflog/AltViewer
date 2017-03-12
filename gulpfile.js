var gulp = require('gulp');
var plumber = require('gulp-plumber');

var browserSync = require('browser-sync').create();

var typescript = require('gulp-typescript');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var pug = require('gulp-pug');
var htmlbeautify = require('gulp-html-beautify');
var dest = {}
var target = "dev";

gulp.task('pug', function buildHTML() {
    return gulp.src('./src/templates/**/*.pug')
        .pipe(plumber())
        .pipe(pug({
            // Your options in here.
        }))
        .pipe(htmlbeautify())
        .pipe(gulp.dest('./' + target + '/'));
});

gulp.task('sass', function() {
    if (target == "dev") {
        gulp.src('./src/stylesheets/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(sass({
                style: 'expanded'
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./' + target + '/assets/css'));
    } else {
        gulp.src('./src/stylesheets/**/*.scss')
            .pipe(plumber())
            .pipe(sass({
                outputStyle: 'compressed'
            }))
            .pipe(gulp.dest('./' + target + '/assets/css'));
    }
});

gulp.task('ts', () => {
    var ts_array = ['popup', 'background', 'contentscript', 'option'];

    for (var value of ts_array) {
        if (target == "dev") {
            gulp.src('./src/scripts/**/' + value + '.ts')
                .pipe(sourcemaps.init())
                .pipe(plumber())
                .pipe(typescript({
                    target: 'ES5',
                    removeComments: false,
                    out: value + '.js'
                }))
                .js
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('./' + target + '/assets/js'));
        }else {
          gulp.src('./src/scripts/**/' + value + '.ts')
              .pipe(sourcemaps.init())
              .pipe(plumber())
              .pipe(typescript({
                  target: 'ES5',
                  removeComments: true,
                  out: value + '.js'
              }))
              .js
              .pipe(gulp.dest('./' + target + '/assets/js'));
        }
    }

});

gulp.task('images', function() {
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./' + target + '/images/'));
});

gulp.task('filescopy', function() {
    gulp.src('./src/*.{md,json}')
        .pipe(gulp.dest('./' + target + '/'));
    gulp.src('./src/_locales/**/*')
        .pipe(gulp.dest('./' + target + '/_locales/'));
    gulp.src('./src/scripts/module/jquery-1.11.1.min.js')
        .pipe(gulp.dest('./' + target + '/assets/js/'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
});

gulp.task('dev', function() {
    target = 'dev';
    // browserSync.init({
    //     server: {
    //         baseDir: './' + target + '/'
    //     }
    // });
    // srcフォルダ以下のファイルを監視
    // gulp.watch('./' + target + '/**', function() {
    //     browserSync.reload(); // ファイルに変更があれば同期しているブラウザをリロード
    // });
    // gulp.task('default', ['sample']);

    gulp.start('filescopy');
    gulp.start('images');
    gulp.start('pug');
    gulp.start('sass');
    gulp.start('ts');
    gulp.watch('./src/**/*.{md,json}', ['filescopy']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/templates/**/*.pug', ['pug']);
    gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
    gulp.watch('./src/scripts/**/*.ts', ['ts']);
});

gulp.task('prod', function() {
    target = 'prod';
    // browserSync.init({
    //     server: {
    //         baseDir: './' + target + '/'
    //     }
    // });
    // srcフォルダ以下のファイルを監視
    // gulp.watch('./' + target + '/**', function() {
    //     browserSync.reload(); // ファイルに変更があれば同期しているブラウザをリロード
    // });

    gulp.start('filescopy');
    gulp.start('images');
    gulp.start('pug');
    gulp.start('sass');
    gulp.start('ts');
    gulp.watch('./src/**/*.{md,json}', ['filescopy']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/templates/**/*.pug', ['pug']);
    gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
    gulp.watch('./src/scripts/**/*.ts', ['ts']);
});
